import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from "vite-plugin-dts";
import noBundlePlugin from "vite-plugin-no-bundle";

export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
            compilerOptions: {
                declarationMap: true,
            }
        }),
        noBundlePlugin(),
    ],
    build: {
        lib: {
            // entry: await fs.promises.readdir(path.join(__dirname, "src"), { recursive: true, withFileTypes: true }).then((files) => {
            //     return files.filter((file) => file.isFile() && file.name.endsWith(".ts") && !file.name.endsWith(".d.ts")).map((file) => path.join(file.parentPath, file.name));
            // }),
            entry: "./src/index.ts",
            formats: ["es"],
        },
        sourcemap: true,
        rollupOptions: {
            external: ["zod"],
        },
    },
});
