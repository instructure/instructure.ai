import {
	Button,
	IconAddSolid,
	IconInfoBorderlessLine,
	Text,
	View,
} from "@instructure/ui";
import type React from "react";

type CTAButtonsProps = {
	isDisabled: boolean;
	setIsTrayOpen?: (isOpen: boolean) => void;
	handleModalButtonClick: () => void;
	handleTrayButtonClick?: () => void;
};

const CTAButtons: React.FC<CTAButtonsProps> = ({
	isDisabled,
	handleModalButtonClick,
	handleTrayButtonClick,
}) => (
	<View
		insetBlockEnd="0"
		insetInlineStart="0"
		padding="medium"
		position="fixed"
	>
		<View as="div" className="cta">
			<Button
				color="primary-inverse"
				margin="small"
				onClick={handleTrayButtonClick}
				renderIcon={<IconInfoBorderlessLine />}
			>
				<Text className="cta">Learn More</Text>
			</Button>
			<Button
				className="cta"
				color="primary-inverse"
				disabled={isDisabled}
				margin="small"
				onClick={handleModalButtonClick}
				renderIcon={<IconAddSolid />}
			>
				Sign up
			</Button>
		</View>
	</View>
);

export default CTAButtons;
