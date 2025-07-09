import { IconButton } from "@instructure/ui-buttons";
import { Flex } from "@instructure/ui-flex";
import { Heading } from "@instructure/ui-heading";
import { IconInfoLine, IconXSolid } from "@instructure/ui-icons";
import { Tray } from "@instructure/ui-tray";
import { View } from "@instructure/ui-view";
import type React from "react";
import HelpTraySectionFeatures from "./HelpTraySectionFeatures";
import HelpTraySectionStages from "./HelpTraySectionStages";

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
			size="small"
		>
			<View as="div" padding="small">
				{TrayHeader}
				<Flex direction="column" padding="small">
					<HelpTraySectionStages />
					<HelpTraySectionFeatures />
				</Flex>
			</View>
		</Tray>
	);
};

export default HelpTray;
