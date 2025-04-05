import * as z from "zod";
import { Endpoint as Endpoint_, endpoint } from "../HttpRequest.js";
import { Session } from "../model/Session.js";

export const Request = z.object({});
export type Request = z.input<typeof Request>;

export const Response = Session;
export type Response = z.output<typeof Session>;

export const Endpoint = endpoint("GetNewSession" as const, Request, Session);
