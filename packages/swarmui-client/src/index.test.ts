import { describe } from "vitest";
import { ServerId, Session, SessionId } from "./model/Session.js";
import { SwarmUIClient } from "./SwarmUIClient.js";
import { UserId } from "./model/User.js";
import { ModelType } from "./model/ModelType.js";
import { Model, RawModel } from "./model/Model.js";
import { UTCDate } from "@date-fns/utc";
import { format } from "date-fns";
import { tz, TZDate } from "@date-fns/tz";

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
                modelName: "il/smoothMixNoobai_noobai.safetensors",
                subType: ModelType.enum.StableDiffusion,
            });

            expect(result).toMatchObject({
                success: true,
                result: {
                    model: {
                        architecture: 'stable-diffusion-xl-v1-base',
                        class: 'Stable Diffusion XL 1.0-Base',
                        compat_class: 'stable-diffusion-xl-v1',
                        is_negative_embedding: false,
                        is_supported_model_format: true,
                        license: null,
                        local: true,
                        name: 'il/smoothMixNoobai_noobai.safetensors',
                        resolution: '1024x1024',
                        special_format: '',
                        standard_height: 1024,
                        standard_width: 1024,
                        title: 'Smooth Mix - (NoobAI/Illustrious/Pony) - NoobAI',
                    }
                }
            });
        });

        test("list models", async ({ expect }) => {
            const client = new SwarmUIClient();
            await client.getNewSession();

            expect(client.session?.session_id).toMatch(/^[0-9a-f]+$/i);

            const result = await client.listModels({
                depth: 100,
                path: "/",
                subtype: ModelType.enum.LoRA,
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

describe("parsing/transform", (test) => {
    test("transform input model type to FullyQualifiedModel", async ({ expect }) => {
        const input: RawModel = {
            architecture: "architecture",
            author: "some author",
            class: "this is the class",
            compat_class: "this is the compat_class",
            date: format(new TZDate("2025/03/19 13:11:29", "America/New_York"), "yyyy/MM/dd HH:mm:ss", { in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) }),
            description: "some description goes here",
            hash_256: "something",
            is_negative_embedding: false,
            is_supported_model_format: true,
            loaded: false,
            local: false,
            name: "this is the name of the model",
            preview_image: "nothing to see here",
            standard_height: 1280,
            standard_width: 1920,
            tags: ["some", "tags", "would", "be", "here"],
            title: "A Title",
            usage_hint: "some usage hint",
            license: "some license",
            merged_from: "some model",
            trigger_phrase: "some trigger phrase",
        };

        const result = Model.parse(input);

        expect(result.date).toBeInstanceOf(UTCDate);
        expect(result.date.toISOString()).toStrictEqual("2025-03-19T17:11:29.000Z");

        expect(result.id).toStrictEqual("something");
    });

});
