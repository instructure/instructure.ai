// src/utils/toTsObjectLiteral.ts

/**
 * Helper for embedding raw TypeScript/TS code in generated output.
 * Use `raw("someCode")` to inline unquoted snippets directly.
 */
export const raw = (code: string) => new RawTs(code);

class RawTs {
	code: string;
	constructor(code: string) {
		try {
			this.code = code;
		} catch (error) {
			throw new Error(`Error in RawTs constructor: ${String(error)}`, { cause: err });
		}
	}
}

/**
 * Convert a JS value into a valid TypeScript literal.
 * Outputs **double-quoted** strings, not template literals.
 */
export function toTsObjectLiteral(value: unknown): string {
	try {
		if (value instanceof RawTs) {return value.code;}
		switch (typeof value) {
			case "string": {
				return JSON.stringify(value);
			}
			case "number":
			case "boolean": {
				return String(value);
			}
			case "undefined": {
				return "undefined";
			}
			case "function": {
				return value.toString();
			}
			case "bigint": {
				return `${value}n`;
			}
			case "object": {
				if (value === null) return "null";
				if (value instanceof Date)
					return `new Date(${JSON.stringify(value.toISOString())})`;
				if (value instanceof RegExp) return value.toString();
				if (value instanceof Map) {
					const entries = Array.from(value.entries()).map(
						([k, v]) => `[${toTsObjectLiteral(k)}, ${toTsObjectLiteral(v)}]`,
					);
					return `new Map([${entries.join(", ")}])`;
				}
				if (value instanceof Set) {
					const items = Array.from(value.values()).map(toTsObjectLiteral);
					return `new Set([${items.join(", ")}])`;
				}
				if (Array.isArray(value)) {
					return `[${value.map(toTsObjectLiteral).join(", ")}]`;
				}
				return `{ ${Object.entries(value as Record<string, unknown>)
					.map(
						([k, v]) =>
							`${isValidIdentifier(k) ? k : JSON.stringify(k)}: ${toTsObjectLiteral(v)}`,
					)
					.join(", ")} }`;
			}
			default: {
				return "undefined";
			}
		}
	} catch (error) {
		throw new Error(`Error in toTsObjectLiteral: ${String(error)}`, { cause: err });
	}
}

function isValidIdentifier(key: string): boolean {
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}
