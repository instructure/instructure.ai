import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const packageName = process.argv[2];

let command = "pnpm turbo run lint";

if (packageName) {
	const fullPackageName = `@instructure.ai/${packageName}`;
	const packagePath = join(__dirname, "../packages", packageName);
	if (existsSync(packagePath)) {
		command += ` --filter=${fullPackageName} -- --assist-enabled=true --config-path=${packagePath}/biome.jsonc`;
	} else {
		console.error(`Package "${packageName}" does not exist in ./packages`);
		process.exit(1);
	}
}

try {
	execSync(command, { stdio: "inherit" });
} catch (error) {
	console.error("Biome check failed:", error);
	process.exit(1);
}
