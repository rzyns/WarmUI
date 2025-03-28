import * as React from "react";
import { Link as RouterLink, RouteObject } from "react-router-dom";

export type Link = {
    path: NonNullable<RouteObject["path"]>,
    label: string,
    icon: React.JSXElementConstructor<any>,
    notifications?: number,
};

export const Link = RouterLink;
