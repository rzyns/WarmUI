import { describe } from "vitest";
import { load } from "./schema.js";

// import { server } from "@vitest/browser/context.js";

describe("ModelDB", (test) => {
    test("should be true", async ({ expect }) => {
        expect(indexedDB).toBeDefined();
        expect(true).toBe(true);

    });
    test("file api", async ({ expect }) => {
        // const { readFile, writeFile, removeFile } = await import("@vitest/browser/context.js").then((a) => a.server.commands);

        const tasks = await load(await fetch("/dump.json").then((a) => a.text()));
        expect(tasks).toBeDefined();

        for (const task of tasks) {
            const result = await task();
            expect(result).toBeDefined();
            console.log("result", result);
            expect(result.rows).toBeDefined();
            if (result.rows) {
                expect(result.rows.length).toBeGreaterThan(0);
                expect(result.rows[0]?.id).toStrictEqual("something");
            }
        }
    });
});
