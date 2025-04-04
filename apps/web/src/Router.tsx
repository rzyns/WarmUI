import { IconVector } from "@tabler/icons-react";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";
import { MantineLogo } from "@mantinex/mantine-logo";
import { Link } from "./Link";
import { HomePage } from "./pages/Home.page";
import { ModelsPage } from "./pages/Models.page";

export const routes = [
    {
        path: "/",
        element: <HomePage />,
        icon: MantineLogo,
        label: "Home",
    },
    {
        path: "/models",
        element: <ModelsPage />,
        icon: IconVector,
        label: "Models",
    },
] as const satisfies Array<RouteObject & Link>;

const router = createBrowserRouter(routes);

export function Router() {
    return <RouterProvider router={router} />;
}
