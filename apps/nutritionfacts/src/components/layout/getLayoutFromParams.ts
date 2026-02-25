import { type PageLayout } from "../../types";

export function getLayoutFromParams(defaultLayout: PageLayout) {
  const params = new URLSearchParams(globalThis.location.search);
  const newLayout = { ...defaultLayout };

  const keys: (keyof PageLayout)[] = ["copyright", "disclaimer", "revision", "permissions"];
  for (const key of keys) {
    if (params.has(key)) {
      newLayout[key] = params.get(key) !== "false";
    }
  }

  return { layout: newLayout };
}
