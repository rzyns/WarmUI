import * as z from "zod";
import * as describeModel from "./endpoint/DescribeModel.js";
import * as session from "./endpoint/GetNewSession.js";
import * as listModels from "./endpoint/ListModels.js";
import { Endpoint, invoke } from "./HttpRequest.js";
import { Session } from "./model/Session.js";
import { ModelType } from "./model/ModelType.js";
import { ListModels } from "./endpoint/index.js";

export class SessionNotInitializedError extends Error {
    static {
        this.prototype.name = "SessionNotInitializedError";
    }
}

type OmitSessionId<T> = Omit<T, "session_id">;

export class SwarmUIClient {
    protected _session: Session | null = null;

    public get session(): Readonly<Session> | null {
        return this._session;
    }

    public async doRequest<N extends string, I extends z.ZodTypeAny, O extends z.ZodTypeAny>(
        endpoint: Endpoint<N, I, O>,
        input: OmitSessionId<z.input<I>>,
    ) {
        if (!this.session) {
            throw new SessionNotInitializedError("Session not initialized");
        }

        return invoke(endpoint, { session_id: this.session.session_id, ...input });
    }

    public async getNewSession(): Promise<Session> {
        const result = await invoke(session.Endpoint, {});

        if (!result.success) {
            throw new Error("Failed to get new session");
        }

        this._session = result.result.result;
        return result.result.result;
    }

    public async listModels(input: OmitSessionId<listModels.RequestInput>) {
        return this.doRequest(listModels.Endpoint, input);
    }

    public async listAllModels(input: Omit<OmitSessionId<listModels.RequestInput>, "subtype">) {
        const tasks = Object.values(ModelType.enum).map(async (subtype) => {
            return [subtype, await this.doRequest(listModels.Endpoint, { ...input, subtype })] as const;
        });

        return (await Promise.all(tasks)).reduce((acc, [subtype, model]) => {
            if (!model.success) {
                throw new Error("Failed to list models");
            }

            acc[subtype] = model.result.result;

            return acc;
        }, {} as Record<ModelType, ListModels.Response>);
    }


    public async describeModel(input: OmitSessionId<describeModel.RequestInput>) {
        return this.doRequest(describeModel.Endpoint, input);
    }
}
