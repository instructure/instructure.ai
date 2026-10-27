import { format } from "vite-plus/fmt";

export async function formatTs(code: string, fileName = "index.tsx"): Promise<string> {
	try {
		const result = await format(fileName, code, {
			arrowParens: "always",
			endOfLine: "lf",
			useTabs: true,
			tabWidth: 2,
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
