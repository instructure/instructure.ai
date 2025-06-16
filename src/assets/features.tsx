import { IconAiSolid, IconCanvasLogoSolid } from "@instructure/ui-icons";
import type { SVGIconProps } from "@instructure/ui-svg-images";
import type { ComponentType } from "react";

export interface Feature {
	icon: ComponentType<SVGIconProps>;
	id: string;
	label: string;
}

const Features: Feature[] = [
	{
		icon: IconAiSolid,
		id: "ignite",
		label: "Ignite AI",
	},
	{
		icon: IconCanvasLogoSolid,
		id: "canvas_career",
		label: "Canvas Career",
	},
];

export default Features;
