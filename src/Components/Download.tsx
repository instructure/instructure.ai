import { IconDownloadLine } from "@instructure/ui";
import { ControlButton } from "./ControlButton.tsx";

const Download = () => {
	window.print();
};

const DownloadControl: React.FC = () => (
	<ControlButton
		Icon={IconDownloadLine}
		label="Save as HTML"
		onClick={Download}
	/>
);

export { DownloadControl };
