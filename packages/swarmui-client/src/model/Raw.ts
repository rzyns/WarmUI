import * as z from "zod";

export const Raw = z.object({
    // id: ModelId,
    // type: ModelType,
    name: z.string(),
    title: z.string().nullable(),
    author: z.string().nullable(),
    description: z.string().nullable(),
    preview_image: z.string(),
    loaded: z.boolean(),
    architecture: z.string().nullable(),
    class: z.string().nullable(),
    compat_class: z.string().nullable(),
    standard_width: z.number().int(),
    standard_height: z.number().int(),
    date: z.string().nullable(),
    tags: z.array(z.string()).nullable(),
    is_supported_model_format: z.boolean(),
    is_negative_embedding: z.boolean(),
    local: z.boolean(),

    usage_hint: z.string().optional().nullable(),
    license: z.string().optional().nullable(),
    trigger_phrase: z.string().optional().nullable(),
    merged_from: z.string().optional().nullable(),

    hash: z.string().optional().nullable(),
    hash_sha256: z.string().optional().nullable(),

    time_created: z.number().optional().nullable(),
    time_modified: z.number().optional().nullable(),
}).passthrough();
export interface Raw extends z.output<typeof Raw> {}

export const RawHashed = Raw.extend({
    hash_sha256: z.string(),
});
export type RawHashed = z.output<typeof RawHashed>;

export const RawUnhashed = Raw.extend({
    hash_sha256: z.never(),
});
export type RawUnhashed = z.output<typeof RawUnhashed>;
