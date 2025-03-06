import * as z from "zod";
import { Model } from "./Model";

export const ModelFileName = z.string().brand("ModelName");
export type ModelFileName = z.output<typeof ModelFileName>;

export const ModelFile = Model.and(z.object({}));
