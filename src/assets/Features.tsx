import type { SVGIconProps } from "@instructure/ui-svg-images";
import type { ComponentType, JSX } from "react";
import React from "react";
import {
	CanvasBug,
	CanvasBugColor,
	IgniteBug,
	IgniteBugColor,
	InstructureBug,
	InstructureBugWhite,
	MasteryBug,
	MasteryBugColor,
	ParchmentBug,
	ParchmentBugColor,
	StudioBug,
	StudioBugColor,
} from "./Logos";
import Stages, { type StageName } from "./Stages";

interface RawFeatureInterface {
	color?: string;
	icon?: ComponentType<SVGIconProps>;
	id: string;
	label: string;
	description?: JSX.Element;
	colorIcon?: ComponentType<SVGIconProps>;
	link?: string;
}

export interface FeatureInterface {
	color: string;
	icon: ComponentType<SVGIconProps>;
	id: string;
	label: string;
	description: JSX.Element;
	stage: StageName;
	colorIcon: ComponentType<SVGIconProps>;
	link?: string;
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
	colorIcon: ComponentType<SVGIconProps>;
}

export const Brands: Record<Exclude<BrandKey, "studio">, BrandInfo> & {
	studio: {
		readonly color: string;
		icon: ComponentType<SVGIconProps>;
		colorIcon: ComponentType<SVGIconProps>;
	};
} = {
	canvas: { color: "#D24E21", colorIcon: CanvasBugColor, icon: CanvasBug },
	ignite: { color: "#9E58BD", colorIcon: IgniteBugColor, icon: IgniteBug },
	instructure: {
		color: "#0E1721",
		colorIcon: InstructureBugWhite,
		icon: InstructureBug,
	},
	mastery: { color: "#3C8645", colorIcon: MasteryBugColor, icon: MasteryBug },
	parchment: {
		color: "#4279B6",
		colorIcon: ParchmentBugColor,
		icon: ParchmentBug,
	},
	studio: {
		get color() {
			return Brands.canvas.color;
		},
		colorIcon: StudioBugColor,
		icon: StudioBug,
	},
};

const { ignite, canvas, studio, mastery, instructure } = Brands;

const RawFeatures: RawFeaturesType = {
	Discovery: [],
	"Early Adopter": [
		{
			description: (
				<>
					AI generated rubrics to streamline rubric creation for educators
					saving them time while promoting fairness, completeness and better
					coverage.
				</>
			),
			id: "rubric_generator",
			label: "Rubric Generator",
		},
		{
			color: canvas.color,
			colorIcon: canvas.colorIcon,
			description: (
				<>
					Canvas Modules are central to how students interact with course
					content, and we're implementing exciting changes to modernize the page
					and add more value.
				</>
			),
			icon: canvas.icon,
			id: "canvas_modules",
			label: "Modules Redesign",
		},
		{
			color: mastery.color,
			colorIcon: mastery.colorIcon,
			icon: mastery.icon,
			id: "mastery_item_generator",
			label: "Mastery Connect Item Generator",
		},
		{
			color: canvas.color,
			colorIcon: canvas.colorIcon,
			description: (
				<>
					Canvas Apps is the new tool for managing LTI tools in Canvas. It
					allows greater flexibility in how tools are configured and used and is
					powered by LearnPlatform.
				</>
			),
			icon: canvas.icon,
			id: "canvas_apps",
			label: "Canvas Apps",
			link: "https://www.instructure.com/k12/products/learnplatform",
		},
		{
			color: canvas.color,
			colorIcon: canvas.colorIcon,
			icon: canvas.icon,
			id: "accessibility_remediation",
			label: "Content Accessibility Remediation",
		},
		{
			color: instructure.color,
			colorIcon: instructure.colorIcon,
			icon: instructure.icon,
			id: "irn",
			label: "Instructure Research Network",
		},
		{
			color: canvas.color,
			colorIcon: canvas.colorIcon,
			description: (
				<>
					Discussion Insights leverages AI to assess student contributions in
					Canvas Discussions, helping instructors evaluate relevance and
					engagement at a glance.
				</>
			),
			icon: canvas.icon,
			id: "discussion_insights",
			label: "Discussion Insights",
		},
		{
			color: studio.color,
			colorIcon: studio.colorIcon,
			icon: studio.icon,
			id: "studio_captioning",
			label: "Studio Caption Review",
		},
		{
			color: canvas.color,
			colorIcon: canvas.colorIcon,
			icon: canvas.icon,
			id: "canvas_quiz_generator",
			label: "Canvas Quizzes Item Generator",
		},
		{
			id: "ignite",
			label: "Ignite Agent",
			link: "http://instructure.com/ignite-ai",
		},
		{
			color: studio.color,
			colorIcon: studio.colorIcon,
			icon: studio.icon,
			id: "media_archiving",
			label: "Studio Media Archive & Restore",
		},
	],
	Excluded: [
		{
			color: canvas.color,
			colorIcon: canvas.colorIcon,
			icon: canvas.icon,
			id: "canvas_admin_experience",
			label: "Canvas Admin Experience",
		},
		{
			color: canvas.color,
			colorIcon: canvas.colorIcon,
			icon: canvas.icon,
			id: "improved_lmgb",
			label: "Improved Learning Mastery Gradebook",
		},
		{
			color: canvas.color,
			colorIcon: canvas.colorIcon,
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
			colorIcon: canvas.colorIcon,
			icon: canvas.icon,
			id: "block_editor",
			label: "Block Content Editor",
		},
		{
			color: canvas.color,
			colorIcon: canvas.colorIcon,
			icon: canvas.icon,
			id: "peer_review",
			label: "Updated Peer Review",
		},
		{
			color: canvas.color,
			colorIcon: canvas.colorIcon,
			icon: canvas.icon,
			id: "concurrent_grading",
			label: "Concurrent Grading",
		},
	],
	Experimentation: [],
	"General Availability": [],
	"Product Preview": [
		{
			color: canvas.color,
			colorIcon: canvas.colorIcon,
			description: (
				<>
					Canvas Career is a a new skills-first LMS designed to help businesses,
					governments, and continuing education organizations deliver flexible,
					industry aligned learning programs that drive business impact.
				</>
			),
			icon: canvas.icon,
			id: "canvas_career",
			label: "Canvas Career",
			link: "https://instructure.com/canvas/canvas-career",
		},
	],
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
				colorIcon: feature.colorIcon ?? ignite.colorIcon,
				description: feature.description ?? <React.Fragment />,
				icon: feature.icon ?? ignite.icon,
				stage: name,
			})),
	]),
);

export default Features;
