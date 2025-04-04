import * as fs from "node:fs";
import * as swarmui from "@rzyns/swarmui-client";
import * as cmd from "cmd-ts";

export const SwarmUiClientCommand = cmd.subcommands({
    name: "swarmui-client",
    description: "",
    version: "0.0.1",
    cmds: {
        validate: cmd.subcommands({
            name: "validate",
            description: "",
            cmds: {
                model: cmd.command({
                    name: "model",
                    description: "",
                    args: {
                        input: cmd.restPositionals({
                            description: "input JSON",
                            displayName: "input",
                            type: cmd.string,
                        }),
                    },
                    handler: async ({ input }) => {
                        console.log("model");
                    },
                }),
            },
        }),
        "dump-models": cmd.command({
            name: "dump-models",
            description: "",
            args: {
                type: cmd.multioption({
                    long: "type",
                    type: cmd.array(
                        cmd.extendType(cmd.string, async (input) => {
                            const value = Object.keys(swarmui.model.ModelType.enum).find(
                                (k) => k.toLowerCase() === input.toLowerCase(),
                            ) as swarmui.model.ModelType | undefined;

                            if (!value) {
                                throw new Error(`Invalid model type: ${input}`);
                            }

                            return value;
                        }),
                    ),
                    defaultValue: () => [],
                    description: "",
                    short: "t",
                }),
                output: cmd.option({
                    long: "output",
                    type: cmd.optional(cmd.string),
                    description: "output file",
                    short: "o",
                }),
            },
            handler: async ({ type, output }) => {
                const client = new swarmui.SwarmUIClient();
                await client.getNewSession();

                const types = type.length
                    ? type
                    : Object.keys(swarmui.model.ModelType.enum).map((k) => swarmui.model.ModelType.parse(k));

                const results = await Promise.allSettled(
                    types.map(
                        async (type) =>
                            [
                                type,
                                await client.listModels({
                                    depth: 100,
                                    path: "/",
                                    subtype: type,
                                }),
                            ] as const,
                    ),
                );

                const data: { [K in swarmui.model.ModelType]?: swarmui.endpoint.ListModels.Response } = {};

                for (const result of results) {
                    if (result.status === "fulfilled") {
                        const [type, value] = result.value;
                        if (value.success) {
                            data[type] = value.result;
                        } else {
                            console.error(`Error fetching models for type ${type}: ${value.error}`);
                        }
                    } else {
                        console.error(result.reason);
                    }
                }

                if (output) {
                    await fs.promises.writeFile(output, JSON.stringify(data, null, 4));
                } else {
                    console.dir(data, { depth: null });
                }
            },
        }),
    },
});

export default SwarmUiClientCommand;

cmd.run(SwarmUiClientCommand, process.argv.slice(2));
