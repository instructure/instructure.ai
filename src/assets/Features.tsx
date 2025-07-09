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
	description?: string;
}

export interface FeatureInterface {
	color: string;
	icon: ComponentType<SVGIconProps>;
	id: string;
	label: string;
	description: string;
	stage: StageName;
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

const { ignite, canvas, studio, mastery, instructure } = Brands;

const RawFeatures: RawFeaturesType = {
	Discovery: [
		{
			color: canvas.color,
			icon: canvas.icon,
			id: "canvas_admin_experience",
			label: "Canvas Admin Experience",
		},
	],
	"Early Adopter": [
		{
			id: "rubric_generator",
			label: "Rubric Generator",
		},
		{
			color: canvas.color,
			icon: canvas.icon,
			id: "canvas_modules",
			label: "Modules Redesign",
		},
		{
			color: mastery.color,
			icon: mastery.icon,
			id: "mastery_item_generator",
			label: "Mastery Connect Item Generator",
		},
		{
			color: canvas.color,
			icon: canvas.icon,
			id: "canvas_apps",
			label: "Canvas Apps",
		},
		{
			color: canvas.color,
			icon: canvas.icon,
			id: "discussion_insights",
			label: "Discussion Insights",
		},
		{
			color: studio.color,
			icon: studio.icon,
			id: "studio_captioning",
			label: "Canvas Studio Caption Review",
		},
		{
			color: canvas.color,
			icon: canvas.icon,
			id: "canvas_quiz_generator",
			label: "Canvas Quizzes Item Generator",
		},
		{
			id: "ignite",
			label: "Ignite Agent",
		},
		{
			color: canvas.color,
			icon: canvas.icon,
			id: "canvas_quiz_generator",
			label: "Canvas Quizzes Item Generator",
		},
		{
			color: studio.color,
			icon: studio.icon,
			id: "media_archiving",
			label: "Canvas Studio Media Archive & Restore",
		},
	],
	Excluded: [
		{
			color: canvas.color,
			icon: canvas.icon,
			id: "improved_lmgb",
			label: "Improved Learning Mastery Gradebook",
		},
		{
			color: canvas.color,
			icon: canvas.icon,
			id: "accessibility_remediation",
			label: "Content Accessibility Remediation",
		},
		{
			color: canvas.color,
			icon: canvas.icon,
			id: "canvas_portfolio",
			label: "Canvas Portfolios",
		},
		{
			id: "grading_assistance",
			label: "Grading Assistance",
		},
		{
			id: "translations",
			label: "Translations",
		},
		{
			color: canvas.color,
			icon: canvas.icon,
			id: "block_editor",
			label: "Block Content Editor",
		},
		{
			color: canvas.color,
			icon: canvas.icon,
			id: "peer_review",
			label: "Updated Peer Review",
		},
		{
			color: canvas.color,
			icon: canvas.icon,
			id: "concurrent_grading",
			label: "Concurrent Grading",
		},
	],
	Experimentation: [],
	"Feature Preview": [
		{
			color: canvas.color,
			icon: canvas.icon,
			id: "canvas_career",
			label: "Canvas Career",
		},
		{
			color: instructure.color,
			icon: instructure.icon,
			id: "irn",
			label: "Instructure Research Network",
		},
	],
	"General Availability": [],
} as const;

const Features: FeaturesType = Object.fromEntries(
	Stages.map(({ name }) => [
		name,
		[...(RawFeatures[name] ?? [])]
			.filter(
				(feature) =>
					!RawFeatures.Excluded.some((excluded) => excluded.id === feature.id),
			)
			.sort((a, b) => a.label.localeCompare(b.label))
			.map((feature) => ({
				...feature,
				color: feature.color ?? ignite.color,
				description: feature.description ?? "",
				icon: feature.icon ?? ignite.icon,
				stage: name,
			})),
	]),
);

export default Features;
