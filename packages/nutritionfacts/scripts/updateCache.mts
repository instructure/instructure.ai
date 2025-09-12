import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Cache, csvUrl } from "../src/assets";

const __dirname: string = dirname(fileURLToPath(import.meta.url));
const cachePath: string = join(__dirname, "../src/assets/cache.csv");

const sha = (str: string): string =>
	createHash("sha256").update(str).digest("hex");

console.log("Updating local cache...");

const response: Response = await fetch(csvUrl);
if (!response.ok)
	throw new Error(`Failed to fetch CSV: ${response.statusText}`);
const remoteCsv: string = await response.text();

console.log(`Fetched ${remoteCsv.length} bytes.`);

const remoteSha: string = sha(remoteCsv);
const localSha: string = sha(Cache);

console.log(`Remote SHA256: ${remoteSha}`);
console.log(`Local  SHA256: ${localSha}`);

if (sha(remoteCsv) !== sha(Cache)) {
	console.log("Writing new version to cache...");
	await writeFile(cachePath, remoteCsv, "utf8");
	console.log("Cache updated.");
} else {
	console.log("Cache is up to date.");
}
