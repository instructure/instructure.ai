import { type PageLayout } from "../types";

class Layout implements PageLayout {
  copyright: boolean;
  disclaimer: boolean;
  revision: boolean;
  permissions: boolean;

  constructor(layout: PageLayout) {
    this.copyright = layout.copyright;
    this.disclaimer = layout.disclaimer;
    this.revision = layout.revision;
    this.permissions = layout.permissions;
  }
}

const DefaultLayout = new Layout({
  copyright: true,
  disclaimer: true,
  permissions: true,
  revision: true,
} as PageLayout);

export { DefaultLayout, Layout };
