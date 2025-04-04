import wasm from "vite-plugin-wasm";
import { defineConfig } from "vitest/config";

export default defineConfig({
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
});
