import { readFileSync } from "node:fs";
import { type Checksum } from "../types";
import checksum from "./checksum.json" with { type: "json" };

const CSVChecksum: Checksum = Object.fromEntries(
	Object.entries(checksum).map(([key, value]) => [key, value]),
);

export const cache = readFileSync(new URL("./cache.csv", import.meta.url), "utf8");
export { CSVChecksum as checksum };
