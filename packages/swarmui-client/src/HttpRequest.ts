import * as z from "zod";

export const SuccessResponse = <T>(t: z.ZodType<T>) =>
    z.object({
        success: z.literal(true),
        result: t,
    });

export type SuccessResponse<T> = {
    success: true;
    result: T;
};

export const ErrorResponse = z.object({
    success: z.literal(false),
    error: z.string(),
}) satisfies z.ZodType<{ success: false; error: string }>;
export interface ErrorResponse extends z.output<typeof ErrorResponse> {}

export const HttpResponse = <T>(t: z.ZodType<T>) =>
    z.discriminatedUnion("success", [SuccessResponse(t), ErrorResponse]);
export type HttpResponse<T> = SuccessResponse<T> | ErrorResponse;

export type Endpoint<N extends string, T, U> = {
    name: N;
    input: z.ZodType<T>;
    output: z.ZodType<U>;
};

export function endpoint<N extends string, T extends z.ZodTypeAny, U extends z.ZodTypeAny>(
    name: N,
    input: T,
    output: U,
): Endpoint<N, z.input<T>, z.output<U>> {
    return { name, input, output } as const;
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

export class JsonParseError extends Error {
    static {
        this.prototype.name = "JsonParseError";
    }
}

// function isResponse(input: unknown) {
//     return typeof input === "object" && input !== null && "success" in input;
// }

function isErrorResponse(input: unknown): input is ErrorResponse {
    return typeof input === "object" && input !== null && "success" in input && input.success === false;
}

export async function invoke<N extends string, I, O>(
    endpoint: Endpoint<N, I, O>,
    input: I,
): Promise<HttpResponse<O>> {
    const url = new URL(`http://172.20.80.1:7801/API/${endpoint.name}`);
    
    const result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        redirect: "manual",
    }).then(
        (d) => d,
        (e) => new HttpError("HTTP Transport Error", { cause: e }),
    );

    if (result instanceof Error) {
        throw result;
    }

    if (result.status === 302 && result.headers.get("Location")?.startsWith("/Error")) {
        const errorMessage = await fetch(`http://172.20.80.1:7801${result.headers.get("Location")}`).then((d) =>
            d.text(),
        );
        throw new HttpError(`HTTP Transport Error ${result.headers.get("Location")}`, {
            cause: errorMessage,
        });
    }

    const json = await result.text().then(
        (d): SuccessResponse<O> | ParseError | JsonParseError => {
            try {
                const parsed = endpoint.output.safeParse(JSON.parse(d));
                if (parsed.success) {
                    return { success: true, result: parsed.data };
                } else {
                    return new ParseError(`${endpoint.name} (Output) parse Error`, {
                        cause: { error: parsed.error, input: parsed },
                    });
                }
            } catch (e) {
                throw new JsonParseError("JSON Parse Error", { cause: e });
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
        // return { success: false, error: json };
        return json;
    }

    return json;
}
