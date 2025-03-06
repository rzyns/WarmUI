import * as z from "zod";
import { Endpoint } from "./model/HttpRequest";
import { Model } from "./model/Model";
import { SessionId } from "./model/Session";
import { ModelFile } from "./model/ModelFile";

export const ListModelsRequest = z.object({
    session_id: SessionId,
    // path	String	What folder path to search within. Use empty string for root.	(REQUIRED)
    path: z.string(),
    // depth	Int32	Maximum depth (number of recursive folders) to search.	(REQUIRED)
    depth: z.number().int(),
    // subtype	String	Model sub-type - LoRA, Wildcards, etc.	Stable-Diffusion
    // sortBy	String	What to sort the list by - Name, DateCreated, or `DateModified.	Name
    // allowRemote	Boolean	If true, allow remote models. If false, only local models.	True
    // sortReverse	Boolean	If true, the sorting should be done in reverse.	False
});
export type ListModelsRequestInput = z.input<typeof ListModelsRequest>;
export type ListModelsRequest = z.output<typeof ListModelsRequest>;

export const ListModelsResponse = z.object({
    folders: z.array(z.string()),
    files: z.array(ModelFile),
}).passthrough();
export type ListModelsResponse = z.output<typeof ListModelsResponse>;

export const ListModelsEndpoint = Endpoint("ListModels" as const, ListModelsRequest, ListModelsResponse);
