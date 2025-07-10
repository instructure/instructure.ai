import { Flex } from "@instructure/ui-flex";
import { Heading } from "@instructure/ui-heading";
import { Text } from "@instructure/ui-text";
import { ToggleDetails } from "@instructure/ui-toggle-details";
import type { FC } from "react";

const HelpTraySectionAbout: FC = () => {
	const toggleHeader = (
		<Heading as="h3" level="h4">
			About
		</Heading>
	);

	return (
		<Flex.Item>
			<ToggleDetails fluidWidth size="large" summary={toggleHeader}>
				<Text as="p" size="small">
					This site lets you indicate your interest in Instructure's upcoming
					features. Depending on the feature, development stage, and your role
					you may or may not be invited to participate in product testing.
				</Text>
				<Text as="p" size="small">
					Please note that many of these features are in early stages of
					development may change substantially before release, or may not be
					released at all. More information on product development stages is
					provided below.
				</Text>
			</ToggleDetails>
		</Flex.Item>
	);
};

export default HelpTraySectionAbout;
