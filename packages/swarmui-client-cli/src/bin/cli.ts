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
            }
        }),
    },
});

export default SwarmUiClientCommand;

if (import.meta.url === `file://${process.argv[1]}`) {
    cmd.run(SwarmUiClientCommand, process.argv.slice(2));
}
