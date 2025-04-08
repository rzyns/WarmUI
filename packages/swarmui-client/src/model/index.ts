import { UTCDate } from "@date-fns/utc";
import * as z from "zod";
import { ModelId } from "./ModelId.js";
import { ModelName } from "./ModelName.js";
import { ModelType } from "./ModelType.js";
import { RawHashed } from "./Raw.js";
import { ModelDate } from "./ModelDate.js";

export * from "./ModelFile.js";
export * from "./ModelId.js";
export * from "./ModelName.js";
export * from "./ModelType.js";
export * from "./Raw.js";
export * from "./Session.js";
export * from "./SortType.js";
export * from "./Timestamp.js";
export * from "./User.js";

const _FullyQualifiedModel = RawHashed.extend({
    name: ModelName,
    id: ModelId,
    type: ModelType,
    license: z.string(),
    trigger_phrase: z.string(),
    merged_from: z.string(),
});
type _FullyQualifiedModel = z.output<typeof _FullyQualifiedModel>;

export const Model = RawHashed.extend({ date: ModelDate.nullable() }).transform((input) => {
    const pathParts = input.name.split("/");
    const folder = pathParts.slice(0, -1).join("/");
    const name = pathParts.slice(-1)[0]! as ModelName;

    return {
        ...input,
        name,
        folder,
        id: input.hash_sha256 as ModelId,
        license: input.license ?? "",
        trigger_phrase: input.trigger_phrase ?? "",
        merged_from: input.merged_from ?? "",
        date: input.date ?? null,
        time_created: input.time_created ? new UTCDate(input.time_created) : null,
        time_modified: input.time_modified ? new UTCDate(input.time_modified) : null,
    } satisfies Omit<_FullyQualifiedModel, "date" | "time_created" | "time_modified"> & {
        name: string,
        folder: string,
        date: UTCDate | null,
        time_created: UTCDate | null,
        time_modified: UTCDate | null,
    };
});
export type ModelInput = z.input<typeof Model>;
export type Model = z.output<typeof Model>;

let _modelInput: ModelInput = {} as unknown as ModelInput;
let _rawModel: RawHashed = {} as unknown as RawHashed;
_modelInput = _rawModel;
_rawModel = _modelInput;
