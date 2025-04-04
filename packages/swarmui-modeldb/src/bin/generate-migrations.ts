import * as fs from "node:fs";
import { join } from "node:path";
import { readMigrationFiles } from "drizzle-orm/migrator";

const migrations = readMigrationFiles({ migrationsFolder: "./drizzle/" });

fs.writeFileSync(join(import.meta.dirname, "../migrations.json"), JSON.stringify(migrations));

console.log("Migrations compiled!");
