import { describe } from "vitest";
import { ServerId, Session, SessionId } from "./model/Session.js";
import { SwarmUIClient } from "./SwarmUIClient.js";
import { UserId } from "./model/User.js";
import { ModelType } from "./model/ModelType.js";

describe("Session", () => {
    describe("basics", (test) => {
        test("get new session", async ({ expect }) => {
            const client = new SwarmUIClient();
            const result = await client.getNewSession();

            expect(client.session).toHaveProperty("session_id", result.session_id);
            expect(client.session).toMatchObject({
                output_append_user: expect.any(Boolean),
                permissions: expect.toSatisfy((a) => Array.isArray(a) && a.every((b) => typeof b === "string")),
                server_id: expect.toSatisfy((a) => ServerId.safeParse(a).success),
                user_id: expect.toSatisfy((a) => UserId.safeParse(a).success),
                session_id: expect.toSatisfy((a) => SessionId.safeParse(a).success),
                version: expect.toSatisfy((a) => typeof a === "string"),
            } satisfies Session);
        });
    });

    describe("models", async (test) => {
        test("describe model", async ({ expect }) => {
            const client = new SwarmUIClient();
            await client.getNewSession();

            expect(client.session?.session_id).toMatch(/^[0-9a-f]+$/i);

            const result = await client.describeModel({
                modelName: "v1-5-pruned-emaonly-fp16",
                subType: ModelType.enum.StableDiffusion,
            });

            expect(result).toMatchObject({
                success: true,
                result: {
                    model: {
                        name: 'v1-5-pruned-emaonly-fp16.safetensors',
                        title: 'Stable Diffusion v1.5',
                        architecture: 'stable-diffusion-v1',
                        class: 'Stable Diffusion v1',
                        compat_class: 'stable-diffusion-v1',
                        resolution: '512x512',
                        standard_width: 512,
                        standard_height: 512,
                        license: 'CreativeML Open RAIL-M',
                        is_supported_model_format: true,
                        is_negative_embedding: false,
                        local: true,
                        special_format: ''
                    }
                }
            });
        });

        test("list models", async ({ expect }) => {
            const client = new SwarmUIClient();
            await client.getNewSession();

            expect(client.session?.session_id).toMatch(/^[0-9a-f]+$/i);

            const result = await client.listModels({
                depth: 1,
                path: "/",
                subtype: ModelType.enum.StableDiffusion,
            });

            expect(result).toMatchObject({
                success: true,
                result: {
                    folders: expect.any(Array),
                    files: expect.any(Array),
                }
            });
        });
    });
});
