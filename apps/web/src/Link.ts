import * as React from "react";
import { RouteObject, Link as RouterLink } from "react-router-dom";

export type Link = {
    path: NonNullable<RouteObject["path"]>;
    label: string;
    icon: React.JSXElementConstructor<any>;
    notifications?: number;
};

export const Link = RouterLink;
