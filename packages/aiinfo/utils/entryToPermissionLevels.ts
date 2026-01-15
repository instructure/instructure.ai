import { permissionLevelsStrings } from "../strings";
import { type Entry, type Result } from "../types";

function entryToPermissionLevels(entry: Entry): Result {
  try {
    const strings = permissionLevelsStrings.en;
    const { permissions, feature } = entry;
    if (!strings.data || !Array.isArray(strings.data)) {
      throw new Error("permissionLevelsStrings.en.data is undefined or not an array");
    }
    const { data } = strings;
    let highlightId: string | undefined;

    const permStr = String(permissions);
    if (typeof permissions === "string" && /^\d+$/.test(permissions) && permStr !== "0") {
      if (data.some((d) => d.level.endsWith(permStr))) {
        highlightId = `L${permStr}`;
      }
    }
    if (typeof permissions === "number") {
      // Numeric permissions should never be highlighted.
    }
    const mapped = data.map((d) =>
      Object.assign(d, {
        highlighted: Boolean(
          d.level.endsWith(permStr) && highlightId === d.level.replace(`LEVEL `, `L`),
        ),
      }),
    );
    return {
      ...strings,
      currentFeature: feature?.name ?? "",
      data: mapped,
    };
  } catch (error) {
    throw new Error(`Error in entryToPermissionLevels: ${(error as Error).message}`, {
      cause: error,
    });
  }
}

export { entryToPermissionLevels };
