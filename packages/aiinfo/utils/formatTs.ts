import { format } from "oxfmt";

export async function formatTs(code: string, fileName = "index.tsx"): Promise<string> {
	try {
		const result = await format(fileName, code, {
			arrowParens: "avoid",
			endOfLine: "lf",
		});
		if (result.errors.length) {
			throw new Error(result.errors.map((error) => error.message).join("\n"));
		}
		return result.code;
	} catch (error) {
		throw new Error(`Error formatting TypeScript code: ${String(error)}`, {
			cause: error,
		});
	}
}
