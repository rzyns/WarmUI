import { config } from "@repo/eslint-config/base.js";
import drizzle from "eslint-plugin-drizzle";

/** @type {import("eslint").Linter.Config[]} */
export default config.concat([{
    plugins: [drizzle],
    rules: {
        'drizzle/enforce-delete-with-where': "error",
        'drizzle/enforce-update-with-where': "error",
    },
}]);
