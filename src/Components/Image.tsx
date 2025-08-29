import { IconImageLine } from "@instructure/ui";
import { ControlButton } from "./ControlButton.tsx";

const Image = () => {
	window.print();
};

const ImageControl: React.FC = () => (
	<ControlButton Icon={IconImageLine} label="Save as image" onClick={Image} />
);

export { ImageControl };
