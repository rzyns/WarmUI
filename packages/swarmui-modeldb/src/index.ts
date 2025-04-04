import { IdbFs, PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { PGliteWorker } from "@electric-sql/pglite/worker";
import { MigrationConfig } from "drizzle-orm/migrator";
import { drizzle } from "drizzle-orm/pglite";
import migrations from "./migrations.json";

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

export async function migrate(db: SwarmUiModelDb) {
    await (db as any).dialect.migrate(
        migrations,
        (db as any).session,
        {
            migrationsTable: "drizzle_migrations",
        } satisfies Omit<MigrationConfig, "migrationsFolder">,
    );
}
