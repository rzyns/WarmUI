import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //import MRT styles

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { EcosystemProvider } from "@zedux/react";
import { MantineProvider } from "@mantine/core";
import { Router } from "./Router";
import { initEcosystem } from "./state";
import { theme } from "./theme";

const queryClient = new QueryClient();
const ecosystem = initEcosystem(queryClient);

export default function App() {
    return (
        <EcosystemProvider ecosystem={ecosystem}>
            <MantineProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <Router />
                </QueryClientProvider>
                <ReactQueryDevtools initialIsOpen={false} client={queryClient} />
            </MantineProvider>
        </EcosystemProvider>
    );
}
