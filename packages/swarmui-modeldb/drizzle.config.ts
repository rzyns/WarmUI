import { defineConfig } from "drizzle-kit";

// type here because we don't want side-effects or whatever
import type { DB_URL } from "./src/index.js";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: "idb://swarmui-modeldb" satisfies DB_URL,
    }
});
