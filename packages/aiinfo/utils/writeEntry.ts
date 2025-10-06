import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { AiInfoFeature } from "../types";

const writeEntry = (entry: AiInfoFeature) => {
	const srcDir = join(__dirname, "../src");
	const entryDir = join(srcDir, entry.uid);
	if (!existsSync(entryDir)) {
		mkdirSync(entryDir, { recursive: true });
	}
};

export { writeEntry };
