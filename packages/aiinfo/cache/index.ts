/// <reference types="vite/client" />

import type { Checksum } from "../types";
import checksum from "./checksum.json" with { type: "json" };

const CSVChecksum: Checksum = Object.fromEntries(
  Object.entries(checksum).map(([key, value]) => [key, value]),
);

export { default as cache } from "./cache.csv?raw";
export { CSVChecksum as checksum };
