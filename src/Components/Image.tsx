import { IconImageLine, type SVGIconProps } from "@instructure/ui";
import { ControlButton } from "./ControlButton.tsx";

const Image = () => {
	window.print();
};

const ImageControl: React.FC = () => (
	<ControlButton
		Icon={IconImageLine as React.ElementType<SVGIconProps>}
		label="Save as image"
		onClick={Image}
	/>
);

export { ImageControl };
