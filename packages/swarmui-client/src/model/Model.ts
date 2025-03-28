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
export interface RawModel extends z.output<typeof RawModel> {}

export const FullyQualifiedModel = RawModel.extend({
    name: ModelName,
    id: ModelId,
    type: ModelType,
    license: z.string(),
    trigger_phrase: z.string(),
    merged_from: z.string(),
});
export type FullyQualifiedModel = z.output<typeof FullyQualifiedModel>;

export const Model = RawModel.transform((input) => ({
    ...input,
    name: input.name as ModelName,
    id: input.id as ModelId,
    type: ModelType.enum.LoRA,
    license: "",
    trigger_phrase: "",
    merged_from: "",
} satisfies FullyQualifiedModel));
export type ModelInput = z.input<typeof Model>;
export type Model = z.output<typeof Model>;

let _modelInput: ModelInput = {} as any;
let _rawModel: RawModel = {} as any;
_modelInput = _rawModel;
_rawModel = _modelInput;
