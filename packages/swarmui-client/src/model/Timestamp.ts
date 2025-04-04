import { TZDate } from "@date-fns/tz";
import { UTCDate } from "@date-fns/utc";
import * as z from "zod";

export const Timestamp: z.ZodType<UTCDate, z.ZodTypeDef, number> = z.number().transform((input) => {
    return new UTCDate(input);
}) satisfies z.ZodType<UTCDate, any, number>;
