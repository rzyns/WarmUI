import * as z from "zod";
import { endpoint } from "../HttpRequest.js";
import { ModelType } from "../model/ModelType.js";
import { Raw } from "../model/Raw.js";
import { SessionId } from "../model/Session.js";
import { SortType } from "../model/SortType.js";

export const Request = z.object({
    session_id: SessionId,
    // path	String	What folder path to search within. Use empty string for root.	(REQUIRED)
    path: z.string(),
    // depth	Int32	Maximum depth (number of recursive folders) to search.	(REQUIRED)
    depth: z.number().int(),
    // subtype	String	Model sub-type - LoRA, Wildcards, etc.	Stable-Diffusion
    subtype: ModelType,
    // sortBy	String	What to sort the list by - Name, DateCreated, or `DateModified.	Name
    sortBy: SortType.default(SortType.enum.NAME),
    // allowRemote	Boolean	If true, allow remote models. If false, only local models.	True
    allowRemote: z.boolean().default(true),
    // sortReverse	Boolean	If true, the sorting should be done in reverse.	False
    sortReverse: z.boolean().default(false),
});
export type RequestInput = z.input<typeof Request>;
export type Request = z.output<typeof Request>;

export const Response = z.object({
    folders: z.array(z.string()),
    files: z.array(Raw)
    // .transform((a): Array<Model> => a.flatMap((model) => {
    //     const result = Model.safeParse(model);
    //     if (result.success) {
    //         return [result.data] as const;
    //     } else {
    //         return [];
    //     }
    // })),
}).passthrough();
export type Response = z.output<typeof Response>;

export const Endpoint = endpoint("ListModels" as const, Request, Response);
