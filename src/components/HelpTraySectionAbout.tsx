import { Flex } from "@instructure/ui-flex";
import { Heading } from "@instructure/ui-heading";
import { Text } from "@instructure/ui-text";
import { ToggleDetails } from "@instructure/ui-toggle-details";
import { View } from "@instructure/ui-view";
import type { FC } from "react";
import ExternalLink from "./ExternalLink";

const HelpTraySectionAbout: FC = () => {
	const toggleHeader = (
		<Heading as="h3" level="h4">
			About
		</Heading>
	);

	return (
		<Flex.Item>
			<ToggleDetails
				defaultExpanded
				fluidWidth
				size="large"
				summary={toggleHeader}
			>
				<View as="div" padding="0 medium">
					<Text as="p" size="small">
						Sign up to receive updates on the new features and products
						announced at{" "}
						<ExternalLink href="https://instructurecon.com">
							Instructurecon 2025
						</ExternalLink>
					</Text>
					<Text as="p" size="small">
						Please note that many of these features are in early stages of
						development may change substantially before release, or may not be
						released at all. More information on features announced is provided
						below.
					</Text>
				</View>
			</ToggleDetails>
		</Flex.Item>
	);
};

export default HelpTraySectionAbout;
