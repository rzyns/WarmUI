import * as sqlite from "drizzle-orm/sqlite-core";
import { drizzle, SqliteRemoteResult } from "drizzle-orm/sqlite-proxy";
import IDBSQL from "idbsql";
import * as swarmui from "@rzyns/swarmui-client";
import { z } from "zod";

export const modelTable = sqlite.sqliteTable("model", {
    id: sqlite.text("id").primaryKey(),
    architecture: sqlite.text("architecture"),
    author: sqlite.text("author"),
    name: sqlite.text("name"),
    class: sqlite.text("class"),
    description: sqlite.text("description"),
    compat_class: sqlite.text("compat_class"),
    date: sqlite.integer("date"),
    is_negative_embedding: sqlite.integer("is_negative_embedding"),
    is_supported_model_format: sqlite.integer("is_supported_model_format"),
    preview_image: sqlite.text("preview_image"),
    standard_height: sqlite.integer("standard_height"),
    standard_width: sqlite.integer("standard_width"),
    title: sqlite.text("title"),
    usage_hint: sqlite.text("usage_hint"),

    data: sqlite.text("data", { mode: "json" }),
} satisfies { id: unknown, data: unknown } & Omit<{
    [K in keyof swarmui.model.Raw as string extends K ? never : K]: unknown;
}, "loaded" | "local" | "tags">);

export const tagsTable = sqlite.sqliteTable("tags", {
    tag: sqlite.text("id").primaryKey(),
});

export const modelTagsTable = sqlite.sqliteTable("model_tags", {
    model_id: sqlite.integer("model_id").references(() => modelTable.id),
    tag_id: sqlite.text("tag_id").references(() => tagsTable.tag),
});

const idbsql = new IDBSQL({
    schema: {
        model: modelTable,
        tags: tagsTable,
        model_tags: modelTagsTable,
    }
});

export const db = drizzle(idbsql.client);

export async function _load(rawData: string) {
    const result = await db.insert(modelTable).values({
        id: "thisisanid",
    }).execute()

    return result;
}

export async function load(rawData: string) {
    const data = z.record(z.string(), z.object({ files: z.array(z.object({}).passthrough())}).passthrough()).parse(JSON.parse(rawData));

    const tasks = Object.entries(data).slice(0, 1).flatMap(([k, v]) => {
        const modelType = swarmui.model.ModelType.parse(k);
        const listModelsResponse = v;

        return listModelsResponse.files.flatMap((file) => {
            const model = swarmui.model.Model.safeParse(file);
            if (model.success) {
                model.data.type = modelType as typeof model.data.type;

                const task = async () => {
                    const stmt = db.insert(modelTable).values({
                        ...model,
                        id: model.data.hash_sha256 ?? "",
                        date: model.data.date instanceof Date ? model.data.date.getUTCDate() : null,
                        is_negative_embedding: model.data.is_negative_embedding ? 1 : 0,
                        is_supported_model_format: model.data.is_supported_model_format ? 1 : 0,
                    });

                    type Row = {
                        [K in keyof (typeof stmt)["_"]["table"]["_"]["columns"]]:
                            (typeof stmt)["_"]["table"]["_"]["columns"][K]["dataType"] extends "string"
                                ? string
                                : (typeof stmt)["_"]["table"]["_"]["columns"][K]["dataType"] extends "number"
                                ? number
                                : (typeof stmt)["_"]["table"]["_"]["columns"][K]["dataType"] extends "boolean"
                                ? boolean
                                : (typeof stmt)["_"]["table"]["_"]["columns"][K]["dataType"] extends "json"
                                ? unknown
                                : never;
                    }

                    return stmt
                        .returning()
                        .onConflictDoUpdate({
                            target: [modelTable.id],
                            set: {
                                ...model,
                                id: model.data.hash_sha256 ?? "",
                                date: model.data.date instanceof Date ? model.data.date.getUTCDate() : null,
                                is_negative_embedding: model.data.is_negative_embedding ? 1 : 0,
                                is_supported_model_format: model.data.is_supported_model_format ? 1 : 0,
                            },
                        })
                        .execute() as Promise<SqliteRemoteResult<Row>>;
                };

                return [task];
            } else {
                return [];
            }
        });
    });

    return tasks;
}
