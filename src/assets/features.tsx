import { IconAiSolid } from "@instructure/ui-icons";
import type { SVGIconProps } from "@instructure/ui-svg-images";
import type { ComponentType } from "react";
import {
	CanvasBug,
	InstructureBug,
	MasteryBug,
	ParchmentBug,
	StudioBug,
} from "./Logos";

interface RawFeatureInterface {
	color?: string;
	icon?: ComponentType<SVGIconProps>;
	id: string;
	label: string;
}

export interface FeatureInterface {
	color: string;
	icon: ComponentType<SVGIconProps>;
	id: string;
	label: string;
}

type BrandKey =
	| "canvas"
	| "ignite"
	| "instructure"
	| "mastery"
	| "parchment"
	| "studio";

interface BrandInfo {
	color: string;
	icon: ComponentType<SVGIconProps>;
}

const brands: Record<Exclude<BrandKey, "studio">, BrandInfo> & {
	studio: { readonly color: string; icon: ComponentType<SVGIconProps> };
} = {
	canvas: { color: "#D24E21", icon: CanvasBug },
	ignite: { color: "#9E58BD", icon: IconAiSolid },
	instructure: { color: "#0E1721", icon: InstructureBug },
	mastery: { color: "#3C8645", icon: MasteryBug },
	parchment: { color: "#4279B6", icon: ParchmentBug },
	studio: {
		get color() {
			return brands.canvas.color;
		},
		icon: StudioBug,
	},
};

const RawFeatures: RawFeatureInterface[] = [
	{
		id: "ignite",
		label: "Ignite Agent",
	},
	{
		color: brands.canvas.color,
		icon: brands.canvas.icon,
		id: "canvas_career",
		label: "Canvas Career",
	},
	{
		id: "rubric_generator",
		label: "Rubric Generator",
	},
	{
		id: "quiz_generator",
		label: "Quiz Item Generator",
	},
	{
		id: "grading_assistance",
		label: "Grading Assistance",
	},
	{
		color: brands.studio.color,
		icon: brands.studio.icon,
		id: "studio_captioning",
		label: "Canvas Studio Enhanced Captioning",
	},
	{
		color: brands.canvas.color,
		icon: brands.canvas.icon,
		id: "canvas_translations",
		label: "Canvas Translations",
	},
	{
		color: brands.ignite.color,
		icon: brands.ignite.icon,
		id: "accessibility_remediation",
		label: "Content Accessibility Remediation",
	},
];

const Features: FeatureInterface[] = RawFeatures.map((feature) => ({
	...feature,
	color: feature.color ?? brands.ignite.color,
	icon: feature.icon ?? brands.ignite.icon,
}));

export default Features;
