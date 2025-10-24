/// <reference types="node" />
import { createRequire } from "node:module";

type AnyMod = Record<string, unknown>;
const _require = createRequire(import.meta.url);

function tryLoad(id: string): AnyMod | null {
	try {
		return _require(id) as AnyMod;
	} catch (e: unknown) {
		if (
			typeof e === "object" &&
			e !== null &&
			"code" in e &&
			(e as { code?: string }).code === "MODULE_NOT_FOUND" &&
			String((e as { message?: string }).message ?? "").includes(`'${id}'`)
		) {
			return null;
		}
		throw e;
	}
}

const mod = tryLoad("@instructure/ui") ?? tryLoad("@instructure/ui-buttons");
if (!mod) {
	throw new Error(
		"Neither '@instructure/ui' nor '@instructure/ui-buttons' is installed. Install one to enable Button support.",
	);
}

export const Button = (mod as AnyMod).Button;
