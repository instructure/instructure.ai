interface VerifiedLink {
  title: string;
  linkUrl: string;
}

// oxlint-disable-next-line max-statements
const isCommunityLink = (href: string, host: string): string | undefined => {
  if (/change[-]?log/i.test(href)) {
    return "changelog";
  }
  if (/time[ ]?line/i.test(href)) {
    return "timeline";
  }
  if (href.includes("faq")) {
    return "faq";
  }
  if (href.includes("the-product-blog")) {
    return "product blog";
  }
  if (href.includes("guide")) {
    return "guides";
  }
  if (host === "community.canvaslms.com") {
    return "community";
  }
  return undefined;
};

const VIDEO_REGEX = /\.(mp4|mov|avi|mkv|mpeg)$/i;
const PLAYER_REGEX = /(?:^|\.)((instructuremedia|youtube|vimeo|wistia|guidde)\.com|youtu\.be)$/i;
const isVideoLink = (href: string, host: string): boolean =>
  VIDEO_REGEX.test(href) || PLAYER_REGEX.test(host);

const IMAGE_REGEX = /\.(jpeg|jpg|gif|png|svg|webp)$/i;
const isImageLink = (href: string): boolean => IMAGE_REGEX.test(href);

const getUrlParts = (linkUrl: string): { href: string; host: string } | null => {
  try {
    const url = new URL(linkUrl);
    return {
      host: url.hostname.toLowerCase(),
      href: url.href.toLowerCase(),
    };
  } catch (error) {
    console.error("Invalid URL:", linkUrl, error);
    return undefined;
  }
};

const getLinkType = (href: string, host: string): string | undefined => {
  const communityType = isCommunityLink(href, host);
  if (communityType) {
    return communityType;
  }
  if (isVideoLink(href, host)) {
    return "video";
  }
  if (isImageLink(href)) {
    return "image";
  }
  return undefined;
};

const getLinkTitle = (link: VerifiedLink): string => {
  const { title, linkUrl } = link;
  const urlParts = getUrlParts(linkUrl);

  if (!urlParts) {
    return title;
  }

  const type = getLinkType(urlParts.href, urlParts.host);
  return type ?? title;
};

export default getLinkTitle;
