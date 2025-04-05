import { describe } from "vitest";
import { init, migrate, pull } from "../../src/index.js";
import { modelsTable, tagsTable } from "../../src/schema.js";
import { SwarmUIClient } from "@rzyns/swarmui-client";

describe("ModelDB", async (test) => {
    test("migrate", async ({ expect }) => {
        const db = await init();

        await migrate(db);

        const tag = {
            tag: "test",
        } as const;

        await db.insert(tagsTable).values(tag);

        const tags = await db.select().from(tagsTable);

        expect(tags).toStrictEqual([tag]);
    });
    test("pull", async ({ expect }) => {
        const db = await init();
        
        await migrate(db);

        const client = new SwarmUIClient();

        try {
            await client.getNewSession();
        } catch (e) {
            console.log(e);
            throw e;
        }

        await pull(db, client);

        const models = await db.select().from(modelsTable);

        expect(models.length).toBeGreaterThan(0);
    });
});
