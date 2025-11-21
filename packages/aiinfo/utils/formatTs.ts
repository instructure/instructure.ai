import ts from "typescript";

export function formatTs(code: string, fileName = "index.tsx"): string {
	try {
		const sourceFile = ts.createSourceFile(
			fileName,
			code,
			ts.ScriptTarget.Latest,
			true,
			ts.ScriptKind.TS,
		);
		const printer = ts.createPrinter({
			newLine: ts.NewLineKind.LineFeed,
			removeComments: false,
		});
		return printer.printFile(sourceFile);
	} catch (error) {
		throw new Error(`Error formatting TypeScript code: ${String(error)}`, { cause: error });
	}
}
