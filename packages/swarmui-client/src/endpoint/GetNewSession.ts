import * as z from "zod";
import { endpoint } from "../HttpRequest.js";
import { Session } from "../model/Session.js";

export const Request = z.object({});

export const Response = Session;
export type Response = z.output<typeof Response>;

export const Endpoint = endpoint("GetNewSession" as const, Request, Response);
