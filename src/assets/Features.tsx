import type { ComponentType, JSX } from "react";
import React from "react";
import {
	CanvasBug,
	CanvasLogo,
	IgniteBug,
	IgniteLogo,
	InstructureBug,
	InstructureLogo,
	MasteryBug,
	MasteryLogo,
	StudioBug,
	StudioLogo,
	type SVGWrapperProps,
} from "./Logos";

interface RawFeatureInterface {
	color?: string;
	icon?: ComponentType<SVGWrapperProps>;
	label: string;
	description?: JSX.Element;
	link?: string;
	title?: string;
}

export interface FeatureInterface {
	color: string;
	icon: ComponentType<SVGWrapperProps>;
	label: string;
	description: JSX.Element;
	link: string | undefined;
	title: string | undefined;
	id: string;
}

type BrandKey = "Canvas" | "IgniteAI" | "Instructure" | "Mastery" | "Studio";

export type FeatureCategory = BrandKey;

export type FeaturesType = Partial<Record<BrandKey, FeatureInterface[]>>;
type RawFeaturesType = Record<BrandKey, RawFeatureInterface[]>;

interface BrandInfo {
	color: string;
	icon: ComponentType<SVGWrapperProps>;
}

export const Brands: Record<BrandKey, BrandInfo> = {
	Canvas: {
		color: CanvasLogo.color,
		icon: CanvasBug,
	},
	IgniteAI: { color: IgniteLogo.color, icon: IgniteBug },
	Instructure: {
		color: InstructureLogo.color,
		icon: InstructureBug,
	},
	Mastery: { color: MasteryLogo.color, icon: MasteryBug },
	Studio: {
		color: StudioLogo.color,
		icon: StudioBug,
	},
};

const { IgniteAI, Canvas, Studio, Mastery, Instructure } = Brands;

const RawFeatures: RawFeaturesType = {
	Canvas: [
		{
			color: Canvas.color,
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
			title: "",
		},
		{
			color: Canvas.color,
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
			title: "",
		},
		{
			color: Canvas.color,
			description: (
				<>
					Enhanced Course Progression for Learners are central to how students
					interact with course content, and we're implementing exciting changes
					to modernize the page and add more value.
				</>
			),
			icon: Canvas.icon,
			label: "Enhanced Course Progression for Learners",
			title: "Canvas",
		},
		{
			color: Canvas.color,
			description: (
				<>
					The Content Accessibility Checker provides on-demand accessibility
					reports and automated remediation of issues in Canvas content.
				</>
			),
			icon: Canvas.icon,
			label: "Course-level Content Accessibility Checker",
			title: "Canvas",
		},
	],
	IgniteAI: [
		{
			description: (
				<>
					IgniteAgent brings AI-powered efficiency to Canvas with
					always-accessible, context-aware assistance for educators—enabling
					faster content creation, course management, and personalized actions
					across 500+ APIs.
				</>
			),
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
					Mastery Item Authoring Assistance uses AI to create quiz questions
					based on provided content, streamlining the quiz creation process for
					instructors and facilitating personalized assessments for students.
				</>
			),
			label: "Mastery Item Authoring Assistance",
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
					Canvas Item Authoring Assistance uses AI to create quiz questions
					based on provided content, streamlining the quiz creation process for
					instructors and facilitating personalized assessments for students.
				</>
			),
			label: "Canvas Item Authoring Assistance",
		},
	],
	Instructure: [
		{
			color: Instructure.color,
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
			title: "",
		},
	],
	Mastery: [],
	Studio: [],
} as const;

const Features = Object.fromEntries(
	Object.entries(RawFeatures).map(([brand, features]) => [
		brand,
		features.map((feature) => ({
			...feature,
			brand: brand as BrandKey,
			color: feature.color ?? IgniteAI.color,
			description: feature.description ?? <React.Fragment />,
			icon: feature.icon ?? IgniteAI.icon,
			id: `${brand}_${feature.label}`.toLowerCase().replace(/[^a-z0-9]/g, "_"),
			label: feature.label,
			link: feature?.link,
			title: feature?.title,
		})),
	]),
) as FeaturesType;

export default Features;
