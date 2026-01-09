import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const projectRoot = process.cwd();

const outRoot = path.join(projectRoot, "public");
const bundleBaseName = "themeEditor";

const outJsFinal = path.join(outRoot, `${bundleBaseName}.js`);
const outJsFromTsdown = path.join(outRoot, `${bundleBaseName}.iife.js`);

const EXIT_SUCCESS = 0;

const run = (cmd: string, args: string[]): Promise<void> =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { shell: process.platform === "win32", stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === EXIT_SUCCESS) {
        resolve();
      } else {
        reject(new Error(`${cmd} exited with code ${code}`));
      }
    });
  });

const renameIfExists = async (from: string, to: string) => {
  try {
    await fs.mkdir(path.dirname(to), { recursive: true });
    await fs.rename(from, to);
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return;
    }
    throw error;
  }
};

const main = async () => {
  // Run tsdown (uses tsdown.config.mts automatically)
  await run("tsdown", []);

  // Rename output to the stable filename your consumer expects
  await renameIfExists(outJsFromTsdown, outJsFinal);

  // eslint-disable-next-line no-console
  console.log(`✅ Built ${path.relative(projectRoot, outJsFinal)}`);
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
