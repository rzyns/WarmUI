import * as z from "zod";
import { Raw } from "./Raw.js";

export const ModelFileName = z.string().brand("ModelFileName");
export type ModelFileName = z.output<typeof ModelFileName>;

export const ModelFile = Raw;
