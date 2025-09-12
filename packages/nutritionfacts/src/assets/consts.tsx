import { Link, type LinkProps } from "@instructure/ui";

const csvUrl =
	"https://docs.google.com/spreadsheets/d/e/2PACX-1vRTUoO92jyiHlJq36oKbtCdL57J7bdOKJbhxRahR2YTR6lTyfhQyo5kidHRwk45jagV9C9DXf80SgfS/pub?gid=2000446087&single=true&output=csv";

const baseUrl =
	typeof window !== "undefined"
		? `${window.location.origin}${window.location.pathname}`
		: "https://instructure.ai/nutritionfacts";

const colors = {
	canvas: "#D42E21",
	instructure: "#0E1721",
	mastery: "#3C8645",
	parchment: "#4279B6",
};

const disclaimer = (color: LinkProps["color"] = "link") => (
	<>
		Instructure has developed nutrition fact labels for AI-enabled products to
		increase transparency and improve decision making.{" "}
		<Link
			data-print="color-link"
			color={color}
			href="https://www.instructure.com/ignite-ai"
			target="_blank"
		>
			Learn more
		</Link>{" "}
		about IgniteAI.
	</>
);

const copyright = `©${new Date().getFullYear()} Instructure, Inc. All rights reserved.`;

export { csvUrl, baseUrl, colors, disclaimer, copyright };
