import { IconDownloadLine, type SVGIconProps } from "@instructure/ui";
import { ControlButton } from "./ControlButton.tsx";

const Download = () => {
	window.print();
};

const DownloadControl: React.FC = () => (
	<ControlButton
		Icon={IconDownloadLine as React.ElementType<SVGIconProps>}
		label="Save as HTML"
		onClick={Download}
	/>
);

export { DownloadControl };
