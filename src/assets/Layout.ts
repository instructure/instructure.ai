import type { PageLayout } from "../types.ts";

class Layout implements PageLayout {
	copyright: boolean;
	disclaimer: boolean;
	header: "horizontal" | "iconOnly" | "stacked" | undefined;
	icon: boolean;

	constructor(layout: PageLayout) {
		this.copyright = layout.copyright;
		this.disclaimer = layout.disclaimer;
		this.header = layout.header;
		this.icon = layout.icon;
	}
}

const DefaultLayout = new Layout({
	copyright: true,
	disclaimer: true,
	header: "horizontal",
	icon: true,
} as PageLayout);

export { DefaultLayout };
