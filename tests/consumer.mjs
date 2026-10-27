import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const cjs = require("@instructure.ai/aiinfo");
const esm = await import("@instructure.ai/aiinfo");
for (const library of [cjs, esm]) {
	assert.equal(library.AiInfo, library.default);
	assert.ok(Object.keys(library.default).length > 0);
	assert.equal(typeof library.default.smartsearch, "object");
	assert.equal(library.default.smartsearch.nutritionFacts, library.nutritionFacts.smartsearch);
	assert.equal(
		library.default.smartsearch.dataPermissionLevels,
		library.dataPermissionLevels.smartsearch,
	);
	assert.equal(library.default.smartsearch.aiInformation, library.aiInformation.smartsearch);
}
assert.deepEqual(esm.default, cjs.default);
console.log(`aiinfo ESM and CommonJS consumer checks passed on ${process.version}`);
