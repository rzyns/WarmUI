
import * as z from "zod";

import { endpoint } from "../HttpRequest.js";
import { ModelName } from "../model/ModelName.js";
import { ModelType } from "../model/ModelType.js";
import { Raw } from "../model/Raw.js";
import { SessionId } from "../model/Session.js";

export const Request = z.object({
    session_id: SessionId,
    modelName: ModelName,
    subType: ModelType,
});
export type RequestInput = z.input<typeof Request>;
export type Request = z.output<typeof Request>;

export const Response = z.object({
    model: Raw,
}).passthrough();
export type Response = z.output<typeof Response>;

export const Endpoint = endpoint("DescribeModel" as const, Request, Response);
