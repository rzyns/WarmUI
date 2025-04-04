import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    core: {
        disableWhatsNewNotifications: true,
        disableTelemetry: true,
        enableCrashReports: false,
    },
    stories: ["../src/**/*.mdx", "../src/**/*.story.@(js|jsx|ts|tsx)"],
    addons: [getAbsolutePath("storybook-dark-mode")],
    framework: {
        name: getAbsolutePath("@storybook/react-vite"),
        options: {},
    },
};

export default config;

function getAbsolutePath(value: string): string {
    return value;
}
