/** @type {import("lint-staged").Configuration} */
export default {
    // Type check TypeScript files
    '(apps|packages)/**/*.(ts|tsx)': () => 'pnpm run type-check',

    // Lint then format TypeScript and JavaScript files
    '(apps|packages)/**/*.(ts|tsx|js)': (filenames) => [
        `pnpx eslint --fix ${filenames.join(' ')}`,
        `pnpx prettier --write ${filenames.join(' ')}`,
    ],
};
