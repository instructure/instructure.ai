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
	colorIcon: ComponentType<SVGIconProps>;
	link?: string;
}

type BrandKey =
	| "Canvas"
	| "IgniteAI"
	| "Instructure"
	| "Mastery"
	| "Parchment"
	| "Studio";

export type FeatureCategory = BrandKey;

export type FeaturesType = Partial<Record<BrandKey, FeatureInterface[]>>;
type RawFeaturesType = Record<BrandKey, RawFeatureInterface[]>;

interface BrandInfo {
	color: string;
	icon: ComponentType<SVGIconProps>;
	colorIcon: ComponentType<SVGIconProps>;
}

export const Brands: Record<BrandKey, BrandInfo> = {
	Canvas: { color: "#D24E21", colorIcon: CanvasBugColor, icon: CanvasBug },
	IgniteAI: { color: "#9E58BD", colorIcon: IgniteBugColor, icon: IgniteBug },
	Instructure: {
		color: "#0E1721",
		colorIcon: InstructureBugWhite,
		icon: InstructureBug,
	},
	Mastery: { color: "#3C8645", colorIcon: MasteryBugColor, icon: MasteryBug },
	Parchment: {
		color: "#4279B6",
		colorIcon: ParchmentBugColor,
		icon: ParchmentBug,
	},
	Studio: {
		get color() {
			return Brands.Canvas.color;
		},
		colorIcon: StudioBugColor,
		icon: StudioBug,
	},
};

const { IgniteAI, Canvas, Studio, Mastery, Instructure } = Brands;

const RawFeatures: RawFeaturesType = {
	Canvas: [
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			description: (
				<>
					Canvas Career is a a new skills-first LMS designed to help businesses,
					governments, and continuing education organizations deliver flexible,
					industry aligned learning programs that drive business impact.
				</>
			),
			icon: Canvas.icon,
			id: "canvas_career",
			label: "Canvas Career",
			link: "https://instructure.com/canvas/canvas-career",
		},
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			description: (
				<>
					Canvas Apps is the new tool for managing LTI tools in Canvas. It
					allows greater flexibility in how tools are configured and used and is
					powered by LearnPlatform.
				</>
			),
			icon: Canvas.icon,
			id: "canvas_apps",
			label: "Canvas Apps",
			link: "https://www.instructure.com/k12/products/learnplatform",
		},
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			description: (
				<>
					Canvas Modules are central to how students interact with course
					content, and we're implementing exciting changes to modernize the page
					and add more value.
				</>
			),
			icon: Canvas.icon,
			id: "canvas_modules",
			label: "Canvas Modules Redesign",
		},
	],
	IgniteAI: [
		{
			id: "ignite",
			label: "Ignite Agent",
			link: "http://instructure.com/ignite-ai",
		},
		{
			color: Canvas.color,
			description: (
				<>
					AI generated rubrics to streamline rubric creation for educators
					saving them time while promoting fairness, completeness and better
					coverage.
				</>
			),
			id: "rubric_generator",
			label: "Canvas Rubric Generator",
		},
		{
			color: Mastery.color,
			id: "mastery_item_generator",
			label: "Mastery Connect Item Generator",
		},
		{
			color: Canvas.color,
			id: "accessibility_remediation",
			label: "Content Accessibility Remediation",
		},
		{
			color: Canvas.color,
			description: (
				<>
					Discussion Insights leverages AI to assess student contributions in
					Canvas Discussions, helping instructors evaluate relevance and
					engagement at a glance.
				</>
			),
			id: "discussion_insights",
			label: "Canvas Discussion Insights",
		},
		{
			color: Studio.color,
			id: "studio_captioning",
			label: "Studio Caption Review",
		},
		{
			color: Canvas.color,
			id: "canvas_quiz_generator",
			label: "Canvas Quizzes Item Generator",
		},
	],
	Instructure: [
		{
			color: Instructure.color,
			colorIcon: Instructure.colorIcon,
			icon: Instructure.icon,
			id: "irn",
			label: "Instructure Research Network",
		},
	],
	Mastery: [],
	Parchment: [],
	Studio: [
		{
			color: Studio.color,
			colorIcon: Studio.colorIcon,
			icon: Studio.icon,
			id: "media_archiving",
			label: "Studio Media Archive & Restore",
		},
	],
	/*
	Excluded: [
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			icon: Canvas.icon,
			id: "canvas_admin_experience",
			label: "Canvas Admin Experience",
		},
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			icon: Canvas.icon,
			id: "improved_lmgb",
			label: "Improved Learning Mastery Gradebook",
		},
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			icon: Canvas.icon,
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
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			icon: Canvas.icon,
			id: "block_editor",
			label: "Block Content Editor",
		},
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			icon: Canvas.icon,
			id: "peer_review",
			label: "Updated Peer Review",
		},
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			icon: Canvas.icon,
			id: "concurrent_grading",
			label: "Concurrent Grading",
		},
	],
	*/
} as const;

const Features = Object.fromEntries(
	Object.entries(RawFeatures).map(([name, features]) => [
		name,
		[...features].map((feature) => ({
			...feature,
			color: feature.color ?? IgniteAI.color,
			colorIcon: feature.colorIcon ?? IgniteAI.colorIcon,
			description: feature.description ?? <React.Fragment />,
			icon: feature.icon ?? IgniteAI.icon,
			stage: name,
		})),
	]),
) as FeaturesType;

export default Features;
