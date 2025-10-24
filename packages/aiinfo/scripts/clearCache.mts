import fs from "node:fs";
import path from "node:path";
import { Log } from "../utils";

const main = async () => {
	const checksumPath = path.resolve(__dirname, "../cache/checksum.json");
	const emptyChecksum = { CSV: "" };
	fs.writeFileSync(checksumPath, JSON.stringify(emptyChecksum, null, 2));
};

const isVitest = typeof process !== "undefined" && process.env.VITEST;

const isViteNodeEntrypoint =
	!isVitest &&
	((process.argv[1] && import.meta.url === `file://${process.argv[1]}`) ||
		import.meta.url.endsWith("/scripts/clearCache.mts") ||
		import.meta.url.endsWith("\\scripts\\clearCache.mts"));

if (isViteNodeEntrypoint) {
	main().catch((err) => {
		Log({ color: "redBright", message: ["Error clearing cache:", err] });
		process.exit(1);
	});
}
export { main, main as clearCache };
