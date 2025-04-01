import { defineConfig } from 'vitest/config'

export default defineConfig({
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
