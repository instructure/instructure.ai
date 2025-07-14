import { Flex } from "@instructure/ui-flex";
import { Heading } from "@instructure/ui-heading";
import { Text } from "@instructure/ui-text";
import { ToggleDetails } from "@instructure/ui-toggle-details";
import { View } from "@instructure/ui-view";
import type { FC } from "react";
import { useState } from "react";
import Features, { type FeatureInterface } from "../assets/Features";
import ExternalLink from "./ExternalLink";

const HelpTraySectionFeatures: FC = () => {
	const [expandedKey, setExpandedKey] = useState<string | null>(null);

	const toggleHeader = (
		<Heading as="h3" level="h4">
			Feature Descriptions
		</Heading>
	);

	const toggleSubHeader = (feature: FeatureInterface) => (
		<View display="inline-flex" style={{ alignItems: "center" }}>
			<View margin="0 xx-small 0 0">
				<feature.colorIcon style={{ verticalAlign: "middle" }} />
			</View>
			<Text size="small" transform="capitalize" weight="bold">
				{feature.label}
			</Text>
		</View>
	);

	const renderFeatureDescription = (feature: FeatureInterface) => {
		return (
			<View as="div" padding="0 medium">
				<Text size="small">{feature.description}</Text>
				{feature.link && (
					<Text as="p" size="small">
						<ExternalLink href={feature.link}>Learn more</ExternalLink>
					</Text>
				)}
			</View>
		);
	};

	const handleToggle = (key: string, expanded: boolean) =>
		setExpandedKey(expanded ? key : null);

	return (
		<Flex.Item>
			<ToggleDetails
				defaultExpanded
				fluidWidth
				size="large"
				summary={toggleHeader}
			>
				<View as="div" padding="small 0">
					{Object.entries(Features).map(([stage, features]) =>
						features.map((feature, idx) => {
							const key = `${stage}_${feature.id}_${idx}`;
							return (
								<View as="div" key={key} padding="0 0 small">
									<ToggleDetails
										expanded={expandedKey === key}
										fluidWidth
										key={key}
										onToggle={(_, expanded) => handleToggle(key, expanded)}
										size="medium"
										summary={toggleSubHeader(feature)}
										variant="filled"
									>
										{renderFeatureDescription(feature)}
									</ToggleDetails>
								</View>
							);
						}),
					)}
				</View>
			</ToggleDetails>
		</Flex.Item>
	);
};

export default HelpTraySectionFeatures;
