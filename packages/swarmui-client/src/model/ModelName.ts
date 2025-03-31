import * as z from "zod";

export const ModelName = z.string().brand("ModelName");
export type ModelName = z.output<typeof ModelName>;
