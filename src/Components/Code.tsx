import { IconCodeLine } from "@instructure/ui";
import { ControlButton } from "./ControlButton.tsx";

const Code = () => {
	window.print();
};

const CodeControl: React.FC = () => (
	<ControlButton Icon={IconCodeLine} label="Save as JSX" onClick={Code} />
);

export { CodeControl };
