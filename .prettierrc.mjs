/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
    tabWidth: 4,
    printWidth: 120,
    singleQuote: false,
    trailingComma: 'all',
    plugins: ['@ianvs/prettier-plugin-sort-imports'],
    importOrder: [
        '.*styles.css$',
        '',
        'dayjs',
        '^react$',
        '^next$',
        '^next/.*$',
        '<BUILTIN_MODULES>',
        '<THIRD_PARTY_MODULES>',
        '^@mantine/(.*)$',
        '^@mantinex/(.*)$',
        '^@mantine-tests/(.*)$',
        '^@docs/(.*)$',
        '^@/.*$',
        '^../(?!.*.css$).*$',
        '^./(?!.*.css$).*$',
        '\\.css$',
    ],
    overrides: [
        {
            files: '*.mdx',
            options: {
                printWidth: 70,
            },
        },
    ],
};

export default config;
