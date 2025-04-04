import wasm from "vite-plugin-wasm";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [wasm()],

    optimizeDeps: {
        exclude: ["@electric-sql/pglite"],
        holdUntilCrawlEnd: true,
    },
    experimental: {
        importGlobRestoreExtension: true,
        skipSsrTransform: true,
    },

    worker: { format: "es" },

    build: {
        copyPublicDir: true,
        emptyOutDir: true,
        lib: {
            entry: "src/index.ts",
            name: "swarmui-modeldb",
            formats: ["es"],
        },
        manifest: true,
        minify: false,
        outDir: "dist",
        rollupOptions: {
            external: Object.keys(await import("./package.json").then((pkg) => pkg.dependencies)),
            cache: false,
            treeshake: true,
        },
        sourcemap: true,
        target: "esnext",
    },
});
