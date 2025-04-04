import { describe } from "vitest";
import { init, migrate } from "./index.js";
import { tagsTable } from "./schema.js";

describe("ModelDB", async (test) => {
    test("something else", async ({ expect }) => {
        const db = await init();

        await migrate(db);

        const tag = {
            tag: "test",
        } as const;

        await db.insert(tagsTable).values(tag);

        const tags = await db.select().from(tagsTable);

        expect(tags).toStrictEqual([tag]);
    });
});
