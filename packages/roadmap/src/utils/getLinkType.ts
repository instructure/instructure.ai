type VerifiedLink = {
  title: string;
  linkUrl: string;
};

const getLinkTitle = (link: VerifiedLink): string => {
  const { title, linkUrl } = link;

  let url: URL;

  try {
    url = new URL(linkUrl);
  } catch (error) {
    console.error("Invalid URL:", linkUrl, error);
    return title;
  }

  const href = url.href.toLowerCase();
  const host = url.hostname.toLowerCase();

  /* Community Links */
  if (/change[-]?log/i.test(href)) return "changelog";
  if (/time[ ]?line/i.test(href)) return "timeline";
  if (href.includes("faq")) return "FAQ";
  if (href.includes("the-product-blog")) return "Product Blog";
  if (href.includes("guide")) return "Guides";
  if (host.endsWith("community.canvaslms.com")) return "Community";

  /* Video Links */
  if (href.match(/\.(mp4|mov|avi|mkv|mpeg)$/)) return "Video";
  if (host.endsWith("instructuremedia.com")) return "Video";
  if (host.endsWith("youtube.com")) return "Video";
  if (host.endsWith("vimeo.com")) return "Video";
  if (host.endsWith("wistia.com")) return "Video";

  /* Image Links */
  if (href.match(/\.(jpeg|jpg|gif|png|svg|webp)$/)) return "Image";

  return title;
};

export default getLinkTitle;