import { nodePolyfills } from "vite-plugin-node-polyfills";
import wasm from "vite-plugin-wasm";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [
        wasm(),
    ],

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
});

function getRequireShim() {
    return `
await (async () => {
  const { dirname } = await import("path");
  const { fileURLToPath } = await import("url");
  /**
   * Shim entry-point related paths.
   */
  if (typeof globalThis.__filename === "undefined") {
    globalThis.__filename = fileURLToPath(import.meta.url);
  }
  if (typeof globalThis.__dirname === "undefined") {
    globalThis.__dirname = dirname(globalThis.__filename);
  }
  /**
   * Shim require if needed.
   */
  if (typeof globalThis.require === "undefined") {
    const { default: module } = await import("module");
    globalThis.require = module.createRequire(import.meta.url);
  }
})();
`;
}
