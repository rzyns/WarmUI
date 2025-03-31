import * as z from "zod";
import { Session } from "../model/Session.js";
import { endpoint } from "../HttpRequest.js";

export const Request = z.object({});

export const Response = Session;
export type Response = z.output<typeof Response>;

export const Endpoint = endpoint("GetNewSession" as const, Request, Response);
