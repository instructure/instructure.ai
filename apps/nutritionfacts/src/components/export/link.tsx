import { LinkInstUIIcon } from "@instructure/ui/latest";
import { type AiInfoFeatureProps } from "@instructure.ai/aiinfo";
import { baseUrl } from "../../assets";
import { ControlButton } from "./";

const PermanentLink = async (id: string) => {
	try {
		await navigator.clipboard.writeText(`${baseUrl}?id=${id}`);
	} catch (error) {
		let msg = "Failed to copy data to clipboard";
		if (error instanceof Error) {
			msg = error.message;
		} else if (typeof error === "string") {
			msg = error;
		}
		console.error(msg);
	}
};

const LinkControl = ({
	product,
	background,
	border,
	color,
}: {
	product: AiInfoFeatureProps;
	background?: boolean;
	border?: boolean;
	color?: "primary" | "primary-inverse";
}) => (
	<ControlButton
		background={background}
		border={border}
		color={color}
		Icon={LinkInstUIIcon}
		key="link"
		label="Copy permalink"
		onClick={() => {
			void PermanentLink(product.uid);
		}}
	/>
);

export { LinkControl };
