import {
	Flex,
	Heading,
	IconButton,
	IconInfoLine,
	IconXSolid,
	Tray,
	View,
} from "@instructure/ui";
import type React from "react";
import HelpTraySectionAbout from "./HelpTraySectionAbout";
import HelpTraySectionFeatures from "./HelpTraySectionFeatures";

type HelpTrayProps = {
	isTrayOpen: boolean;
	setIsTrayOpen: (open: boolean) => void;
};

const HelpTray: React.FC<HelpTrayProps> = ({ isTrayOpen, setIsTrayOpen }) => {
	const hideTray = () => {
		setIsTrayOpen(false);
	};

	const TrayHeader = (
		<Flex>
			<Flex.Item padding="small" shouldGrow shouldShrink>
				<Heading as="h2" color="primary" level="h3">
					<IconInfoLine /> Info
				</Heading>
			</Flex.Item>
			<Flex.Item align="start">
				<IconButton
					onClick={hideTray}
					renderIcon={IconXSolid}
					screenReaderLabel="Close"
					size="small"
					withBackground={false}
					withBorder={false}
				/>
			</Flex.Item>
		</Flex>
	);
	return (
		<Tray
			cellPadding="small"
			enableMask
			label="Tray Example"
			onDismiss={hideTray}
			open={isTrayOpen}
			placement="end"
			shouldCloseOnDocumentClick
			size="regular"
		>
			<View as="div" padding="small">
				{TrayHeader}
				<Flex direction="column" gap="small" padding="small">
					<HelpTraySectionAbout />
					<HelpTraySectionFeatures />
				</Flex>
			</View>
		</Tray>
	);
};

export default HelpTray;
