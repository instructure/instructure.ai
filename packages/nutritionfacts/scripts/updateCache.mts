import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {cacheJson} from "../src/assets";
import type { ProductsMeta } from "../src/types";
import {
	fetchCSV,
	getProductFromLine,
} from "../src/Components/Import/getProductFromCSV";

const {
	cache: Cache,
	features: Features,
}: { cache: ProductsMeta["cache"]; features: ProductsMeta["features"] } =
	cacheJson as ProductsMeta;

const __dirname: string = dirname(fileURLToPath(import.meta.url));

const sha = (str: string): string =>
	createHash("sha256").update(str).digest("hex");


const {raw, parsed: rows} = await fetchCSV();

const remoteSha: string = sha(raw);
const localSha: string = Cache.sha256;


if (remoteSha !== localSha) {
	console.log("Updating local cache...");

	console.log(`Remote SHA256: ${remoteSha}`);
	console.log(`Local SHA256:  ${localSha}`);

	console.log("Writing new version to cache...");

	const cacheJsonPath = join(__dirname, "../src/assets/cache.json");
	const cacheCsvPath = join(__dirname, "../src/assets/cache.csv");

	const newTimestamp = Math.floor(Date.now() / 1000).toString();
	const newCount = rows.length;

	const cachedFeatures = Features || {};

	for (const values of rows) {
		const id = values[0]?.trim().toLowerCase();
		if (!id) continue;
		const newSha = sha(values.join(","));
		if (!(id in cachedFeatures) || cachedFeatures[id].sha256 !== newSha) {
			cachedFeatures[id] = {
				sha256: newSha,
				lastUpdated: newTimestamp,
				nutritionFacts: getProductFromLine(values),
			};
		}
	}

	const newCacheJson: ProductsMeta = {
		cache: {
			sha256: remoteSha,
			lastUpdated: newTimestamp,
			count: newCount,
		},
		features: cachedFeatures,
	};
	await writeFile(cacheJsonPath, JSON.stringify(newCacheJson, null, 2), "utf8");
	await writeFile(cacheCsvPath, raw, "utf8");
	console.log("Cache updated.");
} else {
	console.log("Cache is up to date.");
}
