import wasm from "vite-plugin-wasm";
import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
    {
        test: {
            // an example of file based convention,
            // you don't have to follow it
            include: ["tests/unit/**/*.{test,spec}.ts", "tests/**/*.unit.{test,spec}.ts"],
            name: "unit",
            environment: "node",
        },
    },
    {
        plugins: [wasm()],

        optimizeDeps: {
            exclude: ["@electric-sql/pglite"],
        },

        worker: { format: "es" },

        build: {
            outDir: "dist",
            sourcemap: true,
            minify: false,
            lib: {
                entry: "src/index.ts",
                name: "swarmui-modeldb",
                formats: ["es"],
            },
            rollupOptions: {
                external: Object.keys(await import("./package.json").then((pkg) => pkg.dependencies)),
            },
        },

        test: {
            browser: {
                enabled: true,
                headless: true,
                provider: "playwright",
                // https://vitest.dev/guide/browser/playwright
                instances: [
                    {
                        browser: "chromium",
                        headless: true,
                        viewport: {
                            width: 1280,
                            height: 720,
                        },
                    },
                ],
            },
        },
    },
]);
