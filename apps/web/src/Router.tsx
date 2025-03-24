import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";
import { IconVector } from "@tabler/icons-react";
import { HomePage } from "./pages/Home.page";
import { ModelsPage } from "./pages/Models.page";
import { Link } from "./Link";
import { MantineLogo } from "@mantinex/mantine-logo";

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
    }
] as const satisfies Array<RouteObject & Link>;

const router = createBrowserRouter(routes);

export function Router() {
    return <RouterProvider router={router} />;
}
