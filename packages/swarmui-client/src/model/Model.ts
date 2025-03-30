import * as z from "zod";
import { ModelType } from "./ModelType.js";

import { TZDate } from "@date-fns/tz";
import { UTCDate } from "@date-fns/utc";

export const ModelId = z.string().brand("ModelId");
export type ModelId = z.output<typeof ModelId>;

export const ModelName = z.string().brand("ModelName");
export type ModelName = z.output<typeof ModelName>;

export enum SortTypeEnum {
    // sortBy	String	What to sort the list by - Name, DateCreated, or `DateModified.	Name
    NAME = "Name",
    DATE_CREATED = "DateCreated",
    DATE_MODIFIED = "DateModified",
}

export const SortType = z.nativeEnum(SortTypeEnum);
export type SortType = z.output<typeof SortType>;

export const Timestamp: z.ZodType<UTCDate, z.ZodTypeDef, number> = z.number().transform((input) => {
    return new UTCDate(input)
}) satisfies z.ZodType<UTCDate, any, number>;

export const RawModel = z.object({
    // id: ModelId,
    // type: ModelType,
    name: z.string(),
    title: z.string(),
    author: z.string(),
    description: z.string(),
    preview_image: z.string(),
    loaded: z.boolean(),
    architecture: z.string(),
    class: z.string(),
    compat_class: z.string(),
    standard_width: z.number().int(),
    standard_height: z.number().int(),
    date: z.string(),
    usage_hint: z.string(),
    tags: z.array(z.string()),
    is_supported_model_format: z.boolean(),
    is_negative_embedding: z.boolean(),
    local: z.boolean(),

    license: z.string().optional(),
    trigger_phrase: z.string().optional(),
    merged_from: z.string().optional(),

    hash: z.string().optional(),
    hash_256: z.string().optional(),

    time_created: z.number().optional(),
    time_modified: z.number().optional(),
}).passthrough();
export interface RawModel extends z.output<typeof RawModel> {}

export const RawModelHashed = RawModel.extend({
    hash_256: z.string(),
});
export type RawModelHashed = z.output<typeof RawModelHashed>;

export const RawModelUnhashed = RawModel.extend({
    hash_256: z.never(),
});
export type RawModelUnhashed = z.output<typeof RawModelUnhashed>;

export const FullyQualifiedModel = RawModelHashed.extend({
    name: ModelName,
    id: ModelId,
    type: ModelType,
    license: z.string(),
    trigger_phrase: z.string(),
    merged_from: z.string(),
});
export type FullyQualifiedModel = z.output<typeof FullyQualifiedModel>;

export const Model = RawModelHashed.transform((input) => { 
    return {
        ...input,
        name: input.name as ModelName,
        id: input.hash_256 as ModelId,
        type: ModelType.enum.LoRA,
        date: new UTCDate(new TZDate(input.date, Intl.DateTimeFormat().resolvedOptions().timeZone).toUTCString()),
        license: input.license ?? "",
        trigger_phrase: input.trigger_phrase ?? "",
        merged_from: input.merged_from ?? "",
    } satisfies Omit<FullyQualifiedModel, "date"> & {
        date: UTCDate,
    };
});
export type ModelInput = z.input<typeof Model>;
export type Model = z.output<typeof Model>;

let _modelInput: ModelInput = {} as any;
let _rawModel: RawModelHashed = {} as any;
_modelInput = _rawModel;
_rawModel = _modelInput;
