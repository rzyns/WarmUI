import * as z from "zod";
import * as session from "./GetNewSession.js";
import * as listModels from "./ListModels.js";
import { Endpoint, endpoint, HttpResponse, invoke } from "./model/HttpRequest.js";
import { Session } from "./model/Session.js";
import * as describeModel from "./DescribeModel.js";
import * as assert from "node:assert";

export class SessionNotInitializedError extends Error {
    static { this.prototype.name = "SessionNotInitializedError"; }
}

type OmitSessionId<T> = Omit<T, "session_id">;

export class SwarmUIClient {
    protected _session: Session | null = null;

    public get session(): Readonly<Session> | null {
        return this._session;
    }

    public async doRequest<N extends string, I extends z.ZodTypeAny, O extends z.ZodTypeAny>(endpoint: Endpoint<N, I, O>, input: OmitSessionId<z.input<I>>): Promise<HttpResponse<O>> {
        if (!this.session) {
            throw new SessionNotInitializedError("Session not initialized");
        }

        return invoke(endpoint, { session_id: this.session.session_id, ...input })
    }

    public async getNewSession(): Promise<Session> {
        const result = await invoke(session.Endpoint, {});

        if (!result.success) {
            throw new Error("Failed to get new session");
        }

        this._session = result.result;
        return result.result;
    }

    public async listModels(input: OmitSessionId<listModels.RequestInput>) {
        return this.doRequest(listModels.Endpoint, input);
    }

    public async describeModel(input: OmitSessionId<describeModel.RequestInput>) {
        return this.doRequest(describeModel.Endpoint, input);
    }
}
