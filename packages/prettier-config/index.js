// Documentation for this file: https://prettier.io/docs/en/configuration.html
/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
export default {
    tabWidth: 4,
    useTabs: false,
    arrowParens: "always",
    endOfLine: "lf",
    semi: true,
    proseWrap: "preserve",
    singleQuote: false,
    trailingComma: "all",
    printWidth: 110,

    plugins: ["@ianvs/prettier-plugin-sort-imports"],
    importOrder: [
        ".*styles.css$",
        "",
        "dayjs",
        "^react$",
        "^next$",
        "^next/.*$",
        "<BUILTIN_MODULES>",
        "<THIRD_PARTY_MODULES>",
        "^@mantine/(.*)$",
        "^@mantinex/(.*)$",
        "^@mantine-tests/(.*)$",
        "^@docs/(.*)$",
        "^@/.*$",
        "^../(?!.*.css$).*$",
        "^./(?!.*.css$).*$",
        "\\.css$",
    ],
    overrides: [
        {
            files: "*.mdx",
            options: {
                printWidth: 70,
            },
        },
    ],
};
