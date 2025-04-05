import { TZDate } from "@date-fns/tz";
import { UTCDate } from "@date-fns/utc";
import { parse } from "date-fns";
import * as z from "zod";
import { ModelId } from "./ModelId.js";
import { ModelName } from "./ModelName.js";
import { ModelType } from "./ModelType.js";
import { RawHashed } from "./Raw.js";

export * from "./ModelFile.js";
export * from "./ModelId.js";
export * from "./ModelName.js";
export * from "./ModelType.js";
export * from "./Raw.js";
export * from "./Session.js";
export * from "./SortType.js";
export * from "./Timestamp.js";
export * from "./User.js";

export const DATE_FORMAT = "yyyy/MM/dd HH:mm:ss";

const _FullyQualifiedModel = RawHashed.extend({
    name: ModelName,
    id: ModelId,
    type: ModelType,
    license: z.string(),
    trigger_phrase: z.string(),
    merged_from: z.string(),
});
type _FullyQualifiedModel = z.output<typeof _FullyQualifiedModel>;

export const Model = RawHashed.transform((input) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = input.date
        ? new UTCDate(new TZDate(parse(input.date, DATE_FORMAT, new Date()), timezone).toUTCString())
        : null;
    return {
        ...input,
        name: input.name as ModelName,
        id: input.hash_sha256 as ModelId,
        type: ModelType.enum.LoRA,
        date: date,
        license: input.license ?? "",
        trigger_phrase: input.trigger_phrase ?? "",
        merged_from: input.merged_from ?? "",
        time_created: input.time_created ? new UTCDate(input.time_created) : null,
        time_modified: input.time_modified ? new UTCDate(input.time_modified) : null,
    } satisfies Omit<_FullyQualifiedModel, "date" | "time_created" | "time_modified"> & {
        date: UTCDate | null;
        time_created: UTCDate | null;
        time_modified: UTCDate | null;
    };
});
export type ModelInput = z.input<typeof Model>;
export type Model = z.output<typeof Model>;

let _modelInput: ModelInput = {} as any;
let _rawModel: RawHashed = {} as any;
_modelInput = _rawModel;
_rawModel = _modelInput;
