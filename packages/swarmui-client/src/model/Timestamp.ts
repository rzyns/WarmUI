import * as z from "zod";

import { TZDate } from "@date-fns/tz";
import { UTCDate } from "@date-fns/utc";

export const Timestamp: z.ZodType<UTCDate, z.ZodTypeDef, number> = z.number().transform((input) => {
    return new UTCDate(input)
}) satisfies z.ZodType<UTCDate, any, number>;
