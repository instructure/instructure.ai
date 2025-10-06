import ts from "typescript";

export function formatTs(code: string, fileName = "index.tsx"): string {
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
}
