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
	if (href.includes("faq")) return "faq";
	if (href.includes("the-product-blog")) return "product blog";
	if (href.includes("guide")) return "guides";
	if (host === "community.canvaslms.com") return "community";

	/* Video Links */
	if (
		href.match(/\.(mp4|mov|avi|mkv|mpeg)$/) ||
		host.match(
			/(?:^|\.)((instructuremedia|youtube|vimeo|wistia)\.com|youtu\.be)$/,
		)
	)
		return "video";

	/* Image Links */
	if (href.match(/\.(jpeg|jpg|gif|png|svg|webp)$/)) return "image";

	return title;
};

export default getLinkTitle;
