import { IdbFs, PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { PGliteWorker } from "@electric-sql/pglite/worker";
import { drizzle } from "drizzle-orm/pglite";
import migrations from "./migrations.json";
import { SwarmUIClient } from "@rzyns/swarmui-client";
import { modelsTable } from "./schema";
import { Model } from "../../swarmui-client/dist/model";

export const DB_URL = "idb://swarmui-modeldb" as const;
export type DB_URL = typeof DB_URL;

export type SwarmUiModelDb = Awaited<ReturnType<typeof init>>;

export async function init() {
    const client = await PGliteWorker.create(
        new Worker(new URL("./pg-lite-worker.js?worker", import.meta.url), { type: "module" }),
        {
            fs: new IdbFs("warmui"),
            extensions: { live },
        },
    );

    if (!client.ready) {
        await client.waitReady;
    }

    return drizzle({ client: client as unknown as PGlite });
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

export async function pull(db: SwarmUiModelDb, client_?: SwarmUIClient) {
    const client = client_ ?? new SwarmUIClient();
    await client.getNewSession();
    const result = await client.listAllModels({
        depth: 100,
        path: "/",
    });

    for (const [subtype_, model] of Object.entries(result)) {
        const subtype = subtype_ as keyof typeof result;

        for (const file of model.files) {
            const { id, name, description, createdAt } = file;
            console.log(`Model ID: ${id}, Name: ${name}, Description: ${description}, Created At: ${createdAt}`);

            const hydratedModel = Model.parse(file);

            await db.insert(modelsTable).values([hydratedModel])
        }
    }
}
