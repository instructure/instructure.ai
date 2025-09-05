import type { PageLayout } from "../../types";

export function getLayoutFromParams(defaultLayout: PageLayout) {
	const params = new URLSearchParams(window.location.search);
	const newLayout = { ...defaultLayout };

	if (params.has("copyright")) {
		newLayout.copyright = params.get("copyright") !== "false";
	}
	if (params.has("disclaimer")) {
		newLayout.disclaimer = params.get("disclaimer") !== "false";
	}
	if (params.has("revision")) {
		newLayout.revision = params.get("revision") !== "false";
	}

	const isEditing = params.has("edit") && params.get("edit") !== "false";

	return { isEditing, layout: newLayout };
}
