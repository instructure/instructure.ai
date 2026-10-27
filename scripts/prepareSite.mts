import { cpSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const destination = resolve(root, "dist");
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
cpSync(resolve(root, "public"), destination, { recursive: true });
