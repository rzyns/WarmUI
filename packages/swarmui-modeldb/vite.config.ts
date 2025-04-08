import wasm from "vite-plugin-wasm";
import { defineConfig } from "vite";

const ALL_DEPENDENCIES = Object.keys(await import("./package.json").then((pkg) => pkg.dependencies));

export default defineConfig({
    plugins: [wasm()],

    optimizeDeps: {
        exclude: ALL_DEPENDENCIES,
        holdUntilCrawlEnd: true,
    },
    experimental: {
        importGlobRestoreExtension: true,
        skipSsrTransform: true,
    },

    worker: {
        format: "es",
    },

    build: {
        commonjsOptions: {
            ignoreDynamicRequires: true,
            transformMixedEsModules: true,
        },
        copyPublicDir: true,
        emptyOutDir: true,
        lib: {
            entry: "src/index.ts",
            name: "swarmui-modeldb",
            formats: ["es"],
        },
        manifest: true,
        minify: false,
        terserOptions: {
            compress: false,
            mangle: false,
        },
        outDir: "dist",
        rollupOptions: {
            external: ALL_DEPENDENCIES,
            // cache: false,
            // treeshake: true,
        },
        sourcemap: true,
        target: "esnext",
    },
});
