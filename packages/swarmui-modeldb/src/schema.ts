import { model } from "@rzyns/swarmui-client";
import * as pg from "drizzle-orm/pg-core";

export type TypeToDrizzlePgType<T> = T extends string
    ? pg.PgVarcharBuilder<any>
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
    id: pg.varchar().primaryKey(),
    architecture: pg.varchar(),
    author: pg.varchar(),
    date: pg.timestamp(),
    class: pg.varchar(),
    compat_class: pg.varchar(),
    description: pg.varchar(),
    hash_sha256: pg.varchar(),
    license: pg.varchar(),
    is_negative_embedding: pg.boolean(),
    is_supported_model_format: pg.boolean(),
    loaded: pg.boolean(),
    local: pg.boolean(),
    merged_from: pg.varchar(),
    name: pg.varchar(),
    preview_image: pg.varchar(),
    standard_height: pg.integer(),
    standard_width: pg.integer(),
    tags: pg.varchar().array(),
    title: pg.varchar(),
    trigger_phrase: pg.varchar(),
    type: pg.varchar(),
    hash: pg.varchar(),
    time_created: pg.timestamp(),
    time_modified: pg.timestamp(),
    usage_hint: pg.varchar(),
} satisfies {
    [K in keyof model.Model]: K extends `time_${string}`
        ? pg.PgTimestampBuilder<any>
        : TypeToDrizzlePgType<model.Model[K]>;
});

export const tagsTable = pg.pgTable("tags", {
    tag: pg.varchar().primaryKey(),
});

export const tagsToModelsTable = pg.pgTable("tags_to_models", {
    model_id: pg.varchar().references(() => modelsTable.id),
    tag: pg.varchar().references(() => tagsTable.tag),
});
