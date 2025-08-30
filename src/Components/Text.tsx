import { IconTextLine, type SVGIconProps } from "@instructure/ui";
import { ControlButton } from "./ControlButton.tsx";

const Text: () => void = () => {
	console.log("text.");
};

const TextControl: React.FC = () => (
	<ControlButton
		Icon={IconTextLine as React.ElementType<SVGIconProps>}
		label="Save as plain text"
		onClick={Text}
	/>
);

export { TextControl };
