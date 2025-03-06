
import * as z from "zod";
import { Endpoint } from "./model/HttpRequest";
import { Model, ModelName } from "./model/Model";
import { SessionId } from "./model/Session";
import { ModelType } from "./model/ModelType";

export const DescribeModelRequest = z.object({
    session_id: SessionId,
    modelName: ModelName,
    subType: ModelType,
});
export type DescribeModelRequestInput = z.input<typeof DescribeModelRequest>;
export type DescribeModelRequest = z.output<typeof DescribeModelRequest>;

export const DescribeModelResponse = z.object({
    model: Model,
}).passthrough();
export type DescribeModelResponse = z.output<typeof DescribeModelResponse>;

export const DescribeModelEndpoint = Endpoint("DescribeModel" as const, DescribeModelRequest, DescribeModelResponse);
