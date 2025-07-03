import { canvas } from "@instructure/ui-themes";

export type Stage = {
	name: string;
	abbreviation: string;
	description: string;
	color: string;
};

export type StageName = (typeof Stages)[number]["name"];

const { colors } = canvas;

export const Stages: readonly Stage[] = [
	{
		abbreviation: "GA",
		color: colors.primitives.green45,
		description: "is when the product is generally available to all users",
		name: "General Availability",
	},
	{
		abbreviation: "FP",
		color: colors.primitives.blue45,
		description: "is when we finalize the product for release",
		name: "Feature Preview",
	},
	{
		abbreviation: "EAP",
		color: colors.additionalPrimitives.honey45,
		description: "is when we test with early adopters",
		name: "Early Adopter",
	},
	{
		abbreviation: "Exp",
		color: colors.primitives.orange45,
		description: "is when we explore ideas and concepts",
		name: "Experimentation",
	},
	{
		abbreviation: "Disco",
		color: colors.primitives.red45,
		description: "is when blah blah blah",
		name: "Discovery",
	},
] as const;

export default Stages;
