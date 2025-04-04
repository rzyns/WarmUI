import { readMigrationFiles } from "drizzle-orm/migrator";
import { join } from "node:path";
import * as fs from "node:fs";

const migrations = readMigrationFiles({ migrationsFolder: "./drizzle/" });

fs.writeFileSync(
    join(import.meta.dirname, "../migrations.json"),
    JSON.stringify(migrations),
);

console.log("Migrations compiled!");
