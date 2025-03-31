import * as z from "zod";

export const ModelId = z.string().brand("ModelId");
export type ModelId = z.output<typeof ModelId>;
