import { defineConfig } from 'vitest/config'
import wasm from "vite-plugin-wasm";

export default defineConfig({
    plugins: [ wasm() ],

    optimizeDeps: {
        exclude: ["@electric-sql/pglite"],
    },

    worker: {
        format: 'es'
    },

    build: {
        outDir: 'dist',
        sourcemap: true,
        minify: false,
        lib: {
            entry: 'src/index.ts',
            name: 'swarmui-modeldb',
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
            provider: 'playwright',
            // https://vitest.dev/guide/browser/playwright
            instances: [
                {
                    browser: 'chromium',
                    headless: true,
                    viewport: {
                        width: 1280,
                        height: 720,
                    }
                },
            ],
        },
    },
});
