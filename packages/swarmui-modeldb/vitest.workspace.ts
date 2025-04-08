import { defineConfig, defineWorkspace, mergeConfig } from "vitest/config";

export default defineWorkspace([
    {
        test: {
            // an example of file based convention,
            // you don't have to follow it
            include: ["src/**/*.{test,spec}.ts", "src/**/*.node.{test,spec}.ts"],

            name: "unit",
            environment: "node",
            printConsoleTrace: true,
        },
    },
    mergeConfig(
        (await import("./vite.config.js")).default,
        defineConfig({
            test: {
                include: ["src/**/*.{test,spec}.ts", "src/**/*.browser.{test,spec}.ts"],
                name: "browser",
                testTimeout: 20_000,
                browser: {
                    enabled: true,
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
        }),
    ),
]);
