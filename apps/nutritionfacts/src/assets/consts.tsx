import { Link, type LinkProps } from "@instructure/ui";
import type { AiInfoFeatureProps } from "@instructure.ai/aiinfo";
import { colors } from "./colors";
import {
	CanvasBug,
	IgniteBug,
	InstructureBug,
	MasteryBug,
	ParchmentBug,
	type SVGWrapperProps,
} from "./Logos";

const baseUrl =
	typeof window !== "undefined"
		? `${window.location.origin}${window.location.pathname}`
		: "https://instructure.ai/nutritionfacts";

const brands: Record<
	Lowercase<AiInfoFeatureProps["group"]>,
	{
		name: string;
		color: string;
		icon: React.FC<SVGWrapperProps>;
	}
> = {
	canvas: {
		color: colors.canvas,
		icon: CanvasBug,
		name: "Canvas",
	},
	"canvas career": {
		color: colors.canvas,
		icon: CanvasBug,
		name: "Canvas Career",
	},
	igniteai: {
		color: colors.igniteai,
		icon: IgniteBug,
		name: "IgniteAI",
	},
	"intelligent insights": {
		color: colors.instructure,
		icon: InstructureBug,
		name: "Intelligent Insights",
	},
	mastery: {
		color: colors.mastery,
		icon: MasteryBug,
		name: "Mastery",
	},
	other: {
		color: colors.instructure,
		icon: InstructureBug,
		name: "Other",
	},
	parchment: {
		color: colors.parchment,
		icon: ParchmentBug,
		name: "Parchment",
	},
};

const disclaimer = (color: LinkProps["color"] = "link") => (
	<>
		Instructure has developed nutrition fact labels for AI-enabled products to
		increase transparency and improve decision making.{" "}
		<Link
			color={color}
			data-print="color-link"
			href="https://www.instructure.com/ignite-ai"
			target="_blank"
		>
			Learn more
		</Link>{" "}
		about IgniteAI.
	</>
);

const copyright = `©${new Date().getFullYear()} Instructure, Inc. All rights reserved.`;

export { baseUrl, colors, disclaimer, copyright, brands };
