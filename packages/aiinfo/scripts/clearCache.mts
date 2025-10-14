import fs from "node:fs";
import path from "node:path";
import { Log } from "../utils";

const main = async () => {
	const checksumPath = path.resolve(__dirname, "../cache/checksum.json");
	const emptyChecksum = { CSV: "" };
	fs.writeFileSync(checksumPath, JSON.stringify(emptyChecksum, null, 2));
};

export { main, main as ClearCache };

if (process.env.CLEAR) {
	main().catch((error) => {
		Log({ color: "redBright", message: ["Error updating cache:", error] });
		process.exit(2);
	});
}
