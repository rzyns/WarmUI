import * as z from "zod";
import { ModelType } from "./ModelType.js";

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

export const Model = z.object({
    // id: ModelId,
    // type: ModelType,
    name: ModelName,
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
    // license: z.string(),
    date: z.string(),
    usage_hint: z.string(),
    // trigger_phrase: z.string(),
    // merged_from: z.string(),
    tags: z.array(z.string()),
    is_supported_model_format: z.boolean(),
    is_negative_embedding: z.boolean(),
    local: z.boolean(),
}).passthrough();
export interface Model extends z.output<typeof Model> {}
