import { defineWorkspace } from 'vitest/config';
import * as fs from "node:fs";
import * as path from "node:path";
import { spawnSync } from "node:child_process";


const execOutput = spawnSync("turbo", ["ls", "--output=json"], { shell: true }).output[1]?.toString();
const parsedOutput = JSON.parse(execOutput ?? "[]").packages.items as Array<{ name: string, path: string }>;
const viteConfigs = parsedOutput.map((a) => path.join(a.path, "vite.config.ts")).filter((a) => fs.existsSync(a));

export default defineWorkspace(viteConfigs);
