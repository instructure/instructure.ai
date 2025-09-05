import { IconLinkLine, type SVGIconProps } from "@instructure/ui";
import { baseUrl } from "../../assets";
import { ControlButton } from "./ControlButton.tsx";

const PermanentLink = async (id: string) => {
	try {
		await navigator.clipboard.writeText(`${baseUrl}?id=${id}`);
	} catch (error) {
		let msg: string = "Failed to copy data to clipboard";
		if (error instanceof Error) {
			msg = error.message;
		} else if (typeof error === "string") {
			msg = error;
		}
		console.error(msg);
	}
};

const LinkControl = ({ id }: { id?: string }) => {
	return (
		<ControlButton
			disabled={!id}
			Icon={IconLinkLine as React.ElementType<SVGIconProps>}
			key="link"
			label="Copy permalink"
			onClick={id ? () => PermanentLink(id) : () => {}}
		/>
	);
};

export { LinkControl };
