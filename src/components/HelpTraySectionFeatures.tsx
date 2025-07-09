import { AccessibleContent } from "@instructure/ui-a11y-content";
import { Badge } from "@instructure/ui-badge";
import { Flex } from "@instructure/ui-flex";
import { Heading } from "@instructure/ui-heading";
import { Link } from "@instructure/ui-link";
import { Popover } from "@instructure/ui-popover";
import { Text } from "@instructure/ui-text";
import { ToggleDetails, ToggleGroup } from "@instructure/ui-toggle-details";
import { View } from "@instructure/ui-view";
import type { FC } from "react";
import { useState } from "react";
import Features, { type FeatureInterface } from "../assets/Features";
import Stages from "../assets/Stages";

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
		const stage = Stages.find((stage) => stage.name === feature.stage);
		const badgeColor = stage?.color ?? Stages[2].color;

		if (!stage) return null;
		return (
			<View as="div" padding="0">
				<Popover
					placement="top end"
					renderTrigger={
						<Link aria-describedby={stage.abbreviation} as="abbr">
							<Badge
								margin="0 x-small xxx-small 0"
								standalone
								themeOverride={{ colorPrimary: badgeColor }}
								type="notification"
							/>
						</Link>
					}
					shouldAlignArrow
					shouldRenderOffscreen
					shouldReturnFocus={false}
					withArrow
				>
					<View padding="x-small">
						<Text id={stage.abbreviation} size="small">
							{stage.abbreviation}
						</Text>
					</View>
				</Popover>
				<Text size="small">{feature.description}</Text>
				{feature.link && (
					<Text as="p" size="small">
						<Link href={feature.link} target="_blank">
							<AccessibleContent alt="Learn more">
								Learn more {"\u29C9"}
							</AccessibleContent>
						</Link>
					</Text>
				)}
			</View>
		);
	};

	const handleToggle = (key: string, expanded: boolean) =>
		setExpandedKey(expanded ? key : null);

	return (
		<Flex.Item>
			<ToggleGroup
				border={false}
				size="small"
				summary={toggleHeader}
				toggleLabel="Feature descriptions"
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
			</ToggleGroup>
		</Flex.Item>
	);
};

export default HelpTraySectionFeatures;
