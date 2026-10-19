import path from "node:path";
import baseConfig from "@instructure.ai/shared-configs/vitest";
import { mergeConfig } from "vitest/config";

const __cdir = path.resolve(import.meta.dirname, "coverage");

export default mergeConfig(baseConfig, {
	root: import.meta.dirname,
	test: {
		coverage: {
			reportsDirectory: __cdir,
		},
		environment: "jsdom",
		include: ["index.test.{ts,tsx}"],
	},
});
