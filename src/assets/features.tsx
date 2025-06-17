import { IconAiSolid } from "@instructure/ui-icons";
import type { SVGIconProps } from "@instructure/ui-svg-images";
import type { ComponentType } from "react";
import { CanvasBug, InstructureBug, MasteryBug, ParchmentBug } from "./Logos";

interface RawFeatureInterface {
	brandColor?: string;
	icon?: ComponentType<SVGIconProps>;
	id: string;
	label: string;
}

export interface FeatureInterface {
	brandColor: string;
	icon: ComponentType<SVGIconProps>;
	id: string;
	label: string;
}

type BrandKey =
	| "canvas"
	| "default"
	| "ignite"
	| "instructure"
	| "mastery"
	| "parchment";

interface BrandInfo {
	color: string;
	icon: ComponentType<SVGIconProps>;
}

const brands: Record<BrandKey, BrandInfo> = {
	canvas: { color: "#D24E21", icon: CanvasBug },
	default: { color: "2B7ABC", icon: InstructureBug },
	ignite: { color: "#9E58BD", icon: IconAiSolid },
	instructure: { color: "#0E1721", icon: InstructureBug },
	mastery: { color: "#3C8645", icon: MasteryBug },
	parchment: { color: "#4279B6", icon: ParchmentBug },
};

const RawFeatures: RawFeatureInterface[] = [
	{
		brandColor: brands.ignite.color,
		icon: brands.ignite.icon,
		id: "ignite",
		label: "Ignite Agent",
	},
	{
		brandColor: brands.canvas.color,
		icon: brands.instructure.icon,
		id: "canvas_career",
		label: "Canvas Career",
	},
];

const Features: FeatureInterface[] = RawFeatures.map((feature) => ({
	...feature,
	brandColor: feature.brandColor ?? brands.default.color,
	icon: feature.icon ?? brands.default.icon,
}));

export default Features;
