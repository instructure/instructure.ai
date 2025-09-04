import type { PageLayout } from "../../types";

export function getLayoutFromParams(defaultLayout: PageLayout) {
	const params = new URLSearchParams(window.location.search);
	const newLayout = { ...defaultLayout };

	if (params.get("copyright") === "false") {
		newLayout.copyright = false;
	}
	if (params.get("disclaimer") === "false") {
		newLayout.disclaimer = false;
	}
	if (params.get("revision") === "false") {
		newLayout.revision = false;
	}

	const isPreview = params.has("embed") && params.get("embed") !== "false";

	return { isPreview, layout: newLayout };
}
