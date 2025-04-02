// @ts-check

/** @type {import("syncpack").RcFile} */
const config = {
    "$schema": "./node_modules/syncpack/dist/schema.json",
    "dependencyTypes": ["!local"],
    "indent": "    ",
    "specifierTypes": ["!workspace-protocol"],
    "sortFirst": [
        "name",
        "description",
        "version",
        "author",
        "type",
        "private",
    ],
    "sortPackages": true,
};

module.exports = config;
