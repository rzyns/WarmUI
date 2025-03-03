import mantine from 'eslint-config-mantine';
import tseslint from 'typescript-eslint';
import pluginQuery from "@tanstack/eslint-plugin-query";

export default tseslint.config(
    ...pluginQuery.configs['flat/recommended'],
    ...mantine,
    { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}', './.storybook/main.ts'] },
);
