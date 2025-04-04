import * as z from "zod";

export const SuccessResponse = <T>(t: z.ZodType<T>) =>
    z.object({
        success: z.literal(true),
        result: t,
    });

export type SuccessResponse<T extends z.ZodType> = {
    success: true;
    result: z.output<T>;
};

export const ErrorResponse = z.object({
    success: z.literal(false),
    error: z.string(),
}) satisfies z.ZodType<{ success: false; error: string }>;
export interface ErrorResponse extends z.output<typeof ErrorResponse> {}

export const HttpResponse = <T extends z.ZodType>(t: T) =>
    z.discriminatedUnion("success", [SuccessResponse(t), ErrorResponse]);
export type HttpResponse<T extends z.ZodType> = SuccessResponse<T> | ErrorResponse;

export type Endpoint<N extends string, T extends z.ZodType, U extends z.ZodType> = {
    name: N;
    input: T;
    output: U;
};

export function endpoint<N extends string, T extends z.ZodTypeAny, U extends z.ZodTypeAny>(
    name: N,
    input: T,
    output: U,
): Endpoint<N, T, U> {
    return { name, input, output };
}

export class HttpError extends Error {
    static {
        this.prototype.name = "HttpError";
    }
}

export class ParseError extends Error {
    static {
        this.prototype.name = "ParseError";
    }
}

// function isResponse(input: unknown) {
//     return typeof input === "object" && input !== null && "success" in input;
// }

function isErrorResponse(input: unknown): input is ErrorResponse {
    return typeof input === "object" && input !== null && "success" in input && input.success === false;
}

export async function invoke<N extends string, I extends z.ZodType, O extends z.ZodType>(
    endpoint: Endpoint<N, I, O>,
    input: z.output<I>,
): Promise<SuccessResponse<O> | ErrorResponse> {
    const result = await fetch(`http://localhost:7801/API/${endpoint.name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        redirect: "manual",
    }).then(
        (d) => d,
        (e) => {
            return new HttpError("HTTP Transport Error", { cause: e });
        },
    );

    if (result instanceof Error) {
        throw result;
    }

    if (result.status === 302 && result.headers.get("Location")?.startsWith("/Error")) {
        const errorMessage = await fetch(`http://localhost:7801${result.headers.get("Location")}`).then((d) =>
            d.text(),
        );
        throw new HttpError(`HTTP Transport Error ${result.headers.get("Location")}`, {
            cause: errorMessage,
        });
    }

    const json = await result.text().then(
        (d) => {
            try {
                const data = JSON.parse(d);
                if (typeof data === "object" && data !== null && !("success" in data)) {
                    const parsed = endpoint.output.safeParse(data);
                    if (parsed.success) {
                        return { success: true, result: parsed.data };
                    } else {
                        return new ParseError(`${endpoint.name} (Output) parse Error`, {
                            cause: { error: parsed.error, input: data },
                        });
                    }
                } else {
                    return data;
                }
            } catch (e) {
                throw new ParseError("JSON Parse Error", { cause: e });
            }
        },
        (e) => {
            throw new HttpError("HTTP Transport Error", { cause: e });
        },
    );

    if (json instanceof Error) {
        throw json;
    }

    if (isErrorResponse(json)) {
        return json;
    }

    return json;
}
