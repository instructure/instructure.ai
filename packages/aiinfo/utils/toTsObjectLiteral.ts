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
      throw new Error(`Error in RawTs constructor: ${String(error)}`, {
        cause: error,
      });
    }
  }
}

interface ToTsObjectLiteralOptions {
  replaceStrings?: string[];
}

/**
 * Convert a JS value into a valid TypeScript literal.
 * Outputs **double-quoted** strings, not template literals.
 *
 * @param value - The value to convert to TypeScript literal
 * @param options - Optional configuration
 * @param options.replaceStrings - Array of string values that should be replaced with unquoted identifiers
 */
export function toTsObjectLiteral(
  value: unknown,
  options?: ToTsObjectLiteralOptions,
): string {
  const { replaceStrings = [] } = options ?? {};

  try {
    if (value instanceof RawTs) {
      return value.code;
    }
    switch (typeof value) {
      case "string": {
        // If this string should be replaced with an identifier, return it unquoted
        if (replaceStrings.includes(value)) {
          return value;
        }
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
        if (value === null) {
          return "null";
        }
        if (value instanceof Date) {
          return `new Date(${JSON.stringify(value.toISOString())})`;
        }
        if (value instanceof RegExp) {
          return value.toString();
        }
        if (value instanceof Map) {
          const entries = [...value.entries()].map(
            ([k, v]) => `[${toTsObjectLiteral(k, options)}, ${toTsObjectLiteral(v, options)}]`,
          );
          return `new Map([${entries.join(", ")}])`;
        }
        if (value instanceof Set) {
          const items = [...value.values()].map((v) => toTsObjectLiteral(v, options));
          return `new Set([${items.join(", ")}])`;
        }
        if (Array.isArray(value)) {
          return `[${value.map((v) => toTsObjectLiteral(v, options)).join(", ")}]`;
        }
        return `{ ${Object.entries(value as Record<string, unknown>)
          .map(
            ([k, v]) =>
              `${isValidIdentifier(k) ? k : JSON.stringify(k)}: ${toTsObjectLiteral(v, options)}`,
          )
          .join(", ")} }`;
      }
      default: {
        return "undefined";
      }
    }
  } catch (error) {
    throw new Error(`Error in toTsObjectLiteral: ${String(error)}`, {
      cause: error,
    });
  }
}

function isValidIdentifier(key: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}
