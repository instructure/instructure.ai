import type { PageLayout } from "../types";

class Layout implements PageLayout {
	copyright: boolean;
	disclaimer: boolean;
	revision: boolean;

	constructor(layout: PageLayout) {
		this.copyright = layout.copyright;
		this.disclaimer = layout.disclaimer;
		this.revision = layout.revision;
	}
}

const DefaultLayout = new Layout({
	copyright: true,
	disclaimer: true,
	revision: true,
} as PageLayout);

export { DefaultLayout };
