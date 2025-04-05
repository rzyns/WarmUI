import * as describeModel from "./endpoint/DescribeModel.js";
import * as session from "./endpoint/GetNewSession.js";
import * as listModels from "./endpoint/ListModels.js";
import { Endpoint, HttpResponse, invoke } from "./HttpRequest.js";
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

    public async doRequest<N extends string, I, O>(
        endpoint: Endpoint<N, I, O>,
        input: OmitSessionId<I>,
    ): Promise<HttpResponse<O>> {
        if (!this.session) {
            throw new SessionNotInitializedError("Session not initialized");
        }

        return await invoke(endpoint, endpoint.input.parse({ session_id: this.session.session_id, ...input }))
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
        const response = await this.doRequest(ListModels.Endpoint, input);

        if (response.success) {
            for (let i = 0; i < response.result.files.length; i++) {
                response.result.files[i]!.type = input.subtype;
            }
        }

        return response;
    }

    public async listAllModels(input: Omit<OmitSessionId<listModels.RequestInput>, "subtype">) {
        const tasks = Object.values(ModelType.enum).map(async (subtype) => {
            return [subtype, await this.listModels({ ...input, subtype })] as const;
        });

        return (await Promise.all(tasks)).reduce((acc, [subtype, listModelsResponse]) => {
            if (!listModelsResponse.success) {
                throw new Error("Failed to list models");
            }

            return {
                ...acc,
                [subtype]: listModelsResponse.result,
            };
        }, {} as Record<ModelType, ListModels.Response>);
    }

    public async describeModel(input: OmitSessionId<describeModel.RequestInput>) {
        return this.doRequest(describeModel.Endpoint, input);
    }
}
