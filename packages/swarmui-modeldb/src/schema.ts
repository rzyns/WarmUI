import { model } from "@rzyns/swarmui-client";
import * as pg from "drizzle-orm/pg-core";
import * as swarmui from "@rzyns/swarmui-client";

export type TypeToDrizzlePgType<T> = T extends string
    ? (pg.PgVarcharBuilder<any> | pg.PgTextBuilder<any>)
    : T extends number
      ? pg.PgNumericBuilder<any> | pg.PgIntegerBuilder<any>
      : T extends bigint
        ? pg.PgNumericBigIntBuilder<any>
        : T extends boolean
          ? pg.PgBooleanBuilder<any>
          : T extends Date
            ? pg.PgDateBuilder<any>
            : T extends Array<any>
              ? T extends Array<infer U>
                  ? pg.PgArrayBuilder<any, any>
                  : never
              : never;

export const modelsTable = pg.pgTable("models", {
    id: pg.varchar().$type<swarmui.model.ModelId>().primaryKey(),
    name: pg.varchar().$type<swarmui.model.ModelName>(),
    type: pg.varchar().$type<swarmui.model.ModelType>(),
    architecture: pg.varchar(),
    class: pg.varchar(),
    compat_class: pg.varchar(),
    hash: pg.varchar(),
    hash_sha256: pg.varchar(),
    merged_from: pg.varchar(),
    time_created: pg.timestamp(),
    time_modified: pg.timestamp(),
});

export const modelsMetaTable = pg.pgTable(
    "modelsMeta",
    {
        model_id: pg.varchar().$type<swarmui.model.ModelId>().notNull().references(() => modelsTable.id),
        folder: pg.varchar().notNull(),

        author: pg.varchar(),
        date: pg.timestamp(),
        description: pg.text(),
        license: pg.text(),
        is_negative_embedding: pg.boolean(),
        is_supported_model_format: pg.boolean(),
        preview_image: pg.text(),
        standard_height: pg.integer(),
        standard_width: pg.integer(),
        tags: pg.varchar().array(),
        title: pg.varchar(),
        trigger_phrase: pg.varchar(),
        time_created: pg.timestamp(),
        time_modified: pg.timestamp(),
        usage_hint: pg.varchar(),
    } satisfies {
        [K in Exclude<
            keyof model.Model,
            keyof typeof modelsTable | "loaded" | "local"
        >]: K extends `time_${string}` ? pg.PgTimestampBuilder<any> : TypeToDrizzlePgType<model.Model[K]>;
    } & {
        model_id: unknown,
        folder: unknown,
        time_created: unknown,
        time_modified: unknown,
    },
    (table) => [
        // pg.unique("model_id_folder").on(table.folder, table.model_id),
        pg.primaryKey({
            name: "model_id_pk",
            columns: [table.folder, table.model_id],
        })
    ],
);

export const tagsTable = pg.pgTable("tags", {
    tag: pg.varchar().primaryKey(),
});

export const tagsToModelsMetaTable = pg.pgTable("tags_to_models", {
    tag: pg.varchar().references(() => tagsTable.tag),
    model_id: pg.varchar(),
    folder: pg.varchar(),
}, (table) => [
    pg.foreignKey({
        name: "model_id",
        columns: [table.folder, table.model_id],
        foreignColumns: [modelsMetaTable.folder, modelsMetaTable.model_id],
    })
]);
