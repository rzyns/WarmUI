import { QueryClient } from "@tanstack/react-query";
import { atom, AtomGetters, createEcosystem } from "@zedux/react";

/**
 * Create an atom that will duplicate all the data from React Query (kept in
 * sync by a simple queryCache subscriber). Use this atom like any other atom.
 *
 * The `any` type here is unfortunate. To really type this accurately, you'd
 * have to add the type of every query with every possible set of params.
 */
export const reactQueryBridgeAtom = atom("reactQueryBridge", {} as Record<string, any>);

/**
 * A simple example using a Zedux AtomSelector to derive data originating from
 * React Query. This example reverses each word in the fetched post.
 */
export const getReversedPost = ({ ecosystem, get }: AtomGetters, postId: string) => {
    // TMK, React Query doesn't expose a way to turn a set of params directly into
    // their internal hash strings. However Zedux's param-hashing algorithm is
    // exactly the same and Zedux does expose a way to access it. It isn't
    // _intended_ to be used like this, but it can with a simple type cast and
    // string slice:
    const hash = reactQueryBridgeAtom
        .getInstanceId(ecosystem, ["post", postId] as any)
        .slice(reactQueryBridgeAtom.key.length + 1);

    const val = get(reactQueryBridgeAtom)[hash];

    return val?.data?.body
        .split(" ")
        .map((str: string) => str.split("").reverse().join(""))
        .join(" ");
};

/**
 * A factory for creating the root ecosystem. Should only be used once at the
 * top level of the app.
 */
export const initEcosystem = (queryClient: QueryClient) => {
    const ecosystem = createEcosystem({
        id: "root",
        onReady: (ecosystem) => {
            // keep all query updates in sync with the reactQueryBridgeAtom singleton
            const subscription = queryClient.getQueryCache().subscribe((event) => {
                // this check might not be needed (or even wanted). It filters out
                // events related to observers. You might want to track those too.
                if (!["queryAdded", "queryRemoved", "queryUpdated"].includes(event.type)) {
                    return;
                }

                ecosystem.getInstance(reactQueryBridgeAtom).setStateDeep({
                    [event.query.queryHash]: event.query.state,
                });
            });

            // clean up the subscription when (if) the ecosystem is reset
            return subscription;
        },
    });

    return ecosystem;
};
