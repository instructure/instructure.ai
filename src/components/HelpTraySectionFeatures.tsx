import { Flex, Heading, Text, ToggleDetails, View } from "@instructure/ui";
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
				<feature.icon
					color={feature.color}
					style={{ verticalAlign: "middle" }}
					title={feature.title}
				/>
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
						<ExternalLink href={feature.link}>
							Learn more about {feature.label}
						</ExternalLink>
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
					{Object.entries(Features).flatMap(([stage, features]) =>
						(features ?? []).map((feature, idx) => {
							const key = `${stage}_${feature.id}_${idx}`;
							return (
								<View as="div" key={key} padding="0 0 small">
									<ToggleDetails
										expanded={expandedKey === key}
										fluidWidth
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
