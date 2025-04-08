import { IdbFs, PGlite } from "@electric-sql/pglite";
import { messages } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { PGliteWorker } from "@electric-sql/pglite/worker";
import { drizzle } from "drizzle-orm/pglite";
import { DrizzleError, eq, sql } from "drizzle-orm";
import { NodeFS } from "@electric-sql/pglite/nodefs";
import Worker from "web-worker";

import { SwarmUIClient } from "@rzyns/swarmui-client";
import * as schema from "./schema.js";
import * as swarmui from "@rzyns/swarmui-client";
import migrations from "./migrations.json";

export const DB_URL = "idb://swarmui-modeldb" as const;
export type DB_URL = typeof DB_URL;

export type SwarmUiModelDb = Awaited<ReturnType<typeof init>>;

export async function init() {
    let client: PGlite | PGliteWorker;
    if (typeof window === "undefined") {
        client = await PGlite.create({
            fs: new NodeFS("warmui"),
            extensions: { live },
        });
    } else {
        client = await PGliteWorker.create(
            new Worker(new URL("./pg-lite-worker.js", import.meta.url), { type: "module" }),
            {
                fs: new IdbFs("warmui"),
                extensions: { live },
            },
        );
    }

    if (!client.ready) {
        await client.waitReady;
    }

    return drizzle({ client: client as unknown as PGlite, schema });
}

// export async function migrate(db: SwarmUiModelDb) {
//     await (db as any).dialect.migrate(migrations, (db as any).session, {
//         migrationsTable: "drizzle_migrations",
//     } satisfies Omit<MigrationConfig, "migrationsFolder">);
// }

async function ensureMigrationsTable(db: SwarmUiModelDb) {
    await db.execute(`
    CREATE TABLE IF NOT EXISTS drizzle_migrations (
      hash TEXT PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

async function getMigratedHashes(db: SwarmUiModelDb): Promise<string[]> {
    const result = await db.execute(`
    SELECT hash FROM drizzle_migrations ORDER BY created_at ASC
  `);
    return result.rows.map((row) => row.hash as string);
}

async function recordMigration(db: SwarmUiModelDb, hash: string) {
    await db.execute(
        `
    INSERT INTO drizzle_migrations (hash, created_at)
    VALUES ('${hash}', NOW())
    ON CONFLICT DO NOTHING
  `,
    );
}

export async function migrate(db: SwarmUiModelDb) {
    console.log("🚀 Starting pglite migration...");

    // Ensure migrations table exists
    await ensureMigrationsTable(db);

    // Get already executed migrations
    const executedHashes = await getMigratedHashes(db);

    // Filter and execute pending migrations
    const pendingMigrations = migrations.filter((migration) => !executedHashes.includes(migration.hash));

    if (pendingMigrations.length === 0) {
        console.log("✨ No pending migrations found.");
        return;
    }

    console.log(`📦 Found ${pendingMigrations.length} pending migrations`);

    // Execute migrations in sequence
    for (const migration of pendingMigrations) {
        console.log(`⚡ Executing migration: ${migration.hash}`);
        try {
            // Execute each SQL statement in sequence
            for (const sql of migration.sql) {
                await db.execute(sql);
            }

            // Record successful migration
            await recordMigration(db, migration.hash);
            console.log(`✅ Successfully completed migration: ${migration.hash}`);
        } catch (error) {
            console.error(`❌ Failed to execute migration ${migration.hash}:`, error);
            throw error;
        }
    }

    console.log("🎉 All migrations completed successfully");
}

export type PullOptions = {
    client?: SwarmUIClient,
    limit?: number,
};

export async function pull(db: SwarmUiModelDb, opts: PullOptions = {}) {
    const client = opts.client ?? new SwarmUIClient();
    await client.getNewSession();

    const result = await client.listAllModels({
        depth: 100,
        path: "/",
    });

    let count = 0;
    let skipped = 0;

    for (const [subtype_, value] of Object.entries(result)) {
        const subtype = subtype_ as keyof typeof result;

        for (const file of value.files) {
            if (opts.limit && count >= opts.limit) {
                console.log("Limit reached, stopping...");
                break;
            }

            const parsedModel = swarmui.model.Model.safeParse(file);
            if (!parsedModel.success) {
                console.error("Error parsing model:", parsedModel.error);
                console.error("Model data:", file);
                continue;
            }

            if (await addModel(parsedModel.data, db)) {
                count++;
            } else {
                skipped++;
            }
        }
    }

    return count;
}

async function addModel(model: swarmui.model.Model, db: SwarmUiModelDb) {
    try {
        await db.insert(schema.modelsTable).values(model);
    } catch (e) {
        const existing = await db.select().from(schema.modelsTable).where(eq(schema.modelsTable.id, model.id))!;

        handleDatabaseError("modelsTable", e, existing, model);
    }

    try {
        await db.insert(schema.modelsMetaTable).values({
            ...model,
            folder: model.folder,
            model_id: model.id,
        });
    } catch (e) {
        const existing = (db.query.modelsMetaTable.findFirst({
        where: (modelsMetaTable, { and, eq }) =>
            and(
                eq(modelsMetaTable.folder, sql.placeholder("folder")),
                eq(modelsMetaTable.model_id, model.id)
            ),
        }))!;

        handleDatabaseError("modelsMetaTable", e, existing, model);
    }

    return true;
}

async function handleDatabaseError<A extends object, B extends object>(message: string, e: unknown, existing: A, current: B) {
    if (e instanceof messages.DatabaseError && e.code === "23505") {
        const diff = Object.entries(existing).reduce(
            (acc, [key, value]) => {
                if (existing[key as keyof typeof existing] !== value) {
                    acc[key] = value;
                }
                return acc;
            },
            {} as Record<string, unknown>,
        );

        if (Object.keys(diff).length > 0) {
            console.log("UH OH! Already exists, but with different values");
            console.log("Existing:", existing);
            console.log("Parsed:", current);
            console.log("Diff:", diff);
            throw e;
        }
    } else {
        throw e;
    }
}
