import { Anchor, Text, Title } from "@mantine/core";
import classes from "./Welcome.module.css";
import { atom, useAtomState } from "@zedux/react";
import { FC } from "react";

const greetingAtom = atom('greeting', 'Hello, world!');


const Greeting = (() => {
    const [greeting, setGreeting] = useAtomState(greetingAtom);


    return (
        <label>
            Greeting:
            <input onChange={({ target }) => setGreeting(target.value)} value={greeting} />
        </label>
    );
}) satisfies FC;

async function foo() {
    // const session = await fetch(
    //     "http://localhost:7801/API/GetNewSession",
    //     {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" } satisfies HeadersInit,
    //         body: JSON.stringify({}),
    //     },
    // ).then((res) => res.json());
    // console.log("session", session);

    const result = new Promise((resolve, _reject) => {
        const ws = new WebSocket("ws://localhost:7801/API/SelectModelWS");

        ws.addEventListener("error", console.error);

        const result: object[] = [];
        ws.addEventListener("open", () => {
            ws.send(JSON.stringify({
                session_id: "EAE6198FDB2E8E1B73966BEAC813B48E3631A3BB",
                model: "il/v1/songmix_v13",
            }));
        });

        ws.addEventListener("message", (message) => {
            console.log("received", message);
            try {
                result.push(JSON.parse(message.data));
            } catch (e) {
                console.error(e);
            }
        });

        ws.addEventListener("close", () => {
            console.log("closed");
            resolve(result);
        });

        // const result = await fetch(
        //     "http://localhost:7801/API/SelectModelWS",
        //     {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" } satisfies HeadersInit,
        //         body: JSON.stringify({
        //             session_id: "77F685E1516282708D3D8248CCFD1B0245121669",
        //             model: "",
        //         }),
        //     },
        // ).then((res) => res.json());
    });

    console.log("result", await result);
    return result;
}

export function Welcome() {
    return (
        <>
            <Title className={classes.title} ta="center" mt={100}>
                Welcome to{" "}
                <Text inherit variant="gradient" component="span" gradient={{ from: "pink", to: "yellow" }}>
                    Mantine
                </Text>
            </Title>
            <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
                <Greeting />
                This starter Vite project includes a minimal setup, if you want to learn more on Mantine + Vite
                integration follow{" "}
                <Anchor href="https://mantine.dev/guides/vite/" size="lg">
                    this guide
                </Anchor>
                . To get started edit pages/Home.page.tsx file.

                <button type="button" onClick={foo} >greetingAtom</button>
            </Text>
        </>
    );
}
