type VerifiedLink = {
  title: string;
  linkUrl: string;
};

const getLinkTitle = (link: VerifiedLink): string => {
  const { title, linkUrl } = link;

  let url: string = ""

  try {
    url = new URL(linkUrl).href.toLowerCase();
  } catch (error) {
    console.error("Invalid URL:", linkUrl, error);
    return title;
  }

  /* Community Links */
  if (/change[-]?log/i.test(url)) return "Changelog";
  if (/time[ ]?line/i.test(url)) return "Timeline";
  if (url.includes("faq")) return "FAQ";
  if (url.includes("the-product-blog")) return "Product Blog";
  if (url.includes("guide")) return "Guides";
  if (url.includes("community.canvaslms.com")) return "Community";

  /* Video Links */
  if (url.match(/\.(mp4|mov|avi|mkv|mpeg)$/)) return "Video";
  if (url.includes("instructuremedia.com")) return "Video";
  if (url.includes("youtube.com")) return "Video";
  if (url.includes("vimeo.com")) return "Video";
  if (url.includes("wistia.com")) return "Video";

  /* Image Links */
  if (url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/)) return "Image";

  return title;
};

export default getLinkTitle;