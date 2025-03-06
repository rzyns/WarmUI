import * as z from "zod";
import { Session } from "./model/Session";
import { Endpoint, HttpResponse } from "./model/HttpRequest";

export const GetNewSessionRequest = z.object({});

export const GetNewSessionResponse = Session;
export type GetNewSessionResponse = z.output<typeof GetNewSessionResponse>;

export const GetNewSessionEndpoint = Endpoint("GetNewSession" as const, GetNewSessionRequest, GetNewSessionResponse);
