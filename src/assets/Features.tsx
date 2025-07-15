import type { SVGIconProps } from "@instructure/ui";
import { List } from "@instructure/ui";
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
	label: string;
	description?: JSX.Element;
	colorIcon?: ComponentType<SVGIconProps>;
	link?: string;
}

export interface FeatureInterface {
	color: string;
	icon: ComponentType<SVGIconProps>;
	label: string;
	description: JSX.Element;
	colorIcon: ComponentType<SVGIconProps>;
	link?: string;
	id: string;
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
			label: "Enhanced Course Progression for Learners",
		},
	],
	IgniteAI: [
		{
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
			label: "Canvas Rubric Generator",
		},
		{
			color: Mastery.color,
			description: (
				<>
					Mastery Connect Item Generator uses AI to create quiz questions based
					on provided content, streamlining the quiz creation process for
					instructors and facilitating personalized assessments for students.
				</>
			),
			label: "Mastery Connect Item Generator",
		},
		{
			color: Canvas.color,
			description: (
				<>
					The Content Accessibility Checker provides on-demand accessibility
					reports and automated remediation of issues in Canvas content.
				</>
			),
			label: "Canvas Content Accessibility Checker",
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
			label: "Canvas Discussion Insights",
		},
		{
			color: Studio.color,
			description: (
				<>
					Leveraging AI to proactive showing possible transcript inaccuracies to
					content creators will substantially reduce the time required to review
					videos for accessibility issues.
				</>
			),
			label: "Studio Caption Review",
		},
		{
			color: Canvas.color,
			description: (
				<>
					Canvas Quizzes Item Generator uses AI to create quiz questions based
					on provided content, streamlining the quiz creation process for
					instructors and facilitating personalized assessments for students.
				</>
			),
			label: "Canvas Quizzes Item Generator",
		},
	],
	Instructure: [
		{
			color: Instructure.color,
			colorIcon: Instructure.colorIcon,
			description: (
				<>
					The Instructure Research Network (IRN) is a collaborative network of
					K-12 districts and organizations interested in participating in and
					learning from educational research. It's designed to bring education
					leaders into the research process to inform, test, and improve
					education tools and implementation practices.
				</>
			),
			icon: Instructure.icon,
			label: "Instructure Research Network",
		},
	],
	Mastery: [],
	Parchment: [],
	Studio: [],
	/*
	Excluded: [
		{
			color: Studio.color,
			description: (
				<>
					Studio will use AI to automatically generate caption to and from the
					following languages:
					<List size="small">
						<List.Item>English</List.Item>
						<List.Item>Spanish</List.Item>
						<List.Item>French</List.Item>
						<List.Item>German</List.Item>
						<List.Item>Dutch</List.Item>
					</List>
				</>
			),
			label: "Studio Caption Translation",
		},
		{
			color: Studio.color,
			colorIcon: Studio.colorIcon,
			description: (
				<>
					Studio Archive & Restore will help content creators maintain a cleaner
					video library, prevent unintended content deletion and support
					institutions in complying with their storage policies.
				</>
			),
			icon: Studio.icon,
			label: "Studio Archive & Restore",
		},
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			icon: Canvas.icon,
			label: "Canvas Admin Experience",
		},
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			icon: Canvas.icon,
			label: "Improved Learning Mastery Gradebook",
		},
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			icon: Canvas.icon,
			label: "Canvas Portfolios",
		},
		{
			label: "Grading Assistance",
		},
		{
			label: "Translations",
		},
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			icon: Canvas.icon,
			label: "Block Content Editor",
		},
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			icon: Canvas.icon,
			label: "Updated Peer Review",
		},
		{
			color: Canvas.color,
			colorIcon: Canvas.colorIcon,
			icon: Canvas.icon,
			label: "Concurrent Grading",
		},
	],
	*/
} as const;

const Features = Object.fromEntries(
	Object.entries(RawFeatures).map(([name, features]) => [
		name,
		features.map((feature) => ({
			...feature,
			color: feature.color ?? IgniteAI.color,
			colorIcon: feature.colorIcon ?? IgniteAI.colorIcon,
			description: feature.description ?? <React.Fragment />,
			icon: feature.icon ?? IgniteAI.icon,
			id: `${name}_${feature.label}`.toLowerCase().replace(/[^a-z0-9]/g, "_"),
			stage: name,
		})),
	]),
) as FeaturesType;

export default Features;
