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
import Stages, { type StageName } from "./Stages";

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
export type FeatureCategory = StageName;

export type FeaturesType = Record<FeatureCategory, FeatureInterface[]>;
type RawFeaturesType = Record<FeatureCategory, RawFeatureInterface[]>;

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

export const Brands: Record<Exclude<BrandKey, "studio">, BrandInfo> & {
	studio: { readonly color: string; icon: ComponentType<SVGIconProps> };
} = {
	canvas: { color: "#D24E21", icon: CanvasBug },
	ignite: { color: "#9E58BD", icon: IconAiSolid },
	instructure: { color: "#0E1721", icon: InstructureBug },
	mastery: { color: "#3C8645", icon: MasteryBug },
	parchment: { color: "#4279B6", icon: ParchmentBug },
	studio: {
		get color() {
			return Brands.canvas.color;
		},
		icon: StudioBug,
	},
};

const RawFeatures: RawFeaturesType = {
	Discovery: [],
	"Early Access Program": [
		{
			id: "rubric_generator",
			label: "Rubric Generator",
		},
		{
			id: "grading_assistance",
			label: "Grading Assistance",
		},
		{
			color: Brands.studio.color,
			icon: Brands.studio.icon,
			id: "studio_captioning",
			label: "Canvas Studio Enhanced Captioning",
		},
	],
	Experimentation: [
		{
			id: "quiz_generator",
			label: "Quiz Item Generator",
		},
		{
			color: Brands.ignite.color,
			icon: Brands.ignite.icon,
			id: "accessibility_remediation",
			label: "Content Accessibility Remediation",
		},
	],
	"Feature Preview": [
		{
			id: "ignite",
			label: "Ignite Agent",
		},
		{
			color: Brands.canvas.color,
			icon: Brands.canvas.icon,
			id: "canvas_career",
			label: "Canvas Career",
		},
	],
	"General Availability": [],
} as const;

const Features: FeaturesType = Object.fromEntries(
	Stages.map(({ name }) => [
		name,
		[...(RawFeatures[name] ?? [])]
			.sort((a, b) => a.label.localeCompare(b.label))
			.map((feature) => ({
				...feature,
				color: feature.color ?? Brands.ignite.color,
				icon: feature.icon ?? Brands.ignite.icon,
			})),
	]),
);

export default Features;
