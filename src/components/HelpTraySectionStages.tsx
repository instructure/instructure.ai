import { Badge } from "@instructure/ui-badge";
import { Flex } from "@instructure/ui-flex";
import { Heading } from "@instructure/ui-heading";
import { Link } from "@instructure/ui-link";
import { Popover } from "@instructure/ui-popover";
import { Text } from "@instructure/ui-text";
import { ToggleDetails, ToggleGroup } from "@instructure/ui-toggle-details";
import { View } from "@instructure/ui-view";
import type { FC } from "react";
import Stages, { type Stage } from "../assets/Stages";

const HelpTraySectionStages: FC = () => {
	const toggleHeader = (
		<Heading as="h3" level="h4">
			Product Stages
		</Heading>
	);

	const toggleSubHeader = (stage: Stage) => (
		<>
			<Badge
				margin="0 x-small xxx-small 0"
				standalone
				themeOverride={{ colorPrimary: stage.color }}
				type="notification"
			/>
			<Text as="dfn" size="small">
				{stage.name}
			</Text>
		</>
	);

	const renderStageDescription = (stage: Stage) => (
		<View as="div" padding="0">
			<Popover
				placement="top end"
				renderTrigger={
					<Link aria-describedby={stage.name} as="abbr">
						{stage.abbreviation}
					</Link>
				}
				shouldAlignArrow
				shouldRenderOffscreen
				shouldReturnFocus={false}
				withArrow
			>
				<View padding="x-small">
					<Text id={stage.name} size="small">
						{stage.name}
					</Text>
				</View>
			</Popover>{" "}
			<Text size="small">{stage.description}</Text>
		</View>
	);

	return (
		<Flex.Item>
			<ToggleGroup
				border={false}
				defaultExpanded={true}
				size="small"
				summary={toggleHeader}
				toggleLabel="Product development definitions"
			>
				<View as="div" padding="small 0">
					{Stages.map((stage: Stage) => (
						<View as="div" key={stage.name} padding="0 0 small">
							<ToggleDetails
								fluidWidth
								key={stage.name}
								size="medium"
								summary={toggleSubHeader(stage)}
								variant="filled"
							>
								{renderStageDescription(stage)}
							</ToggleDetails>
						</View>
					))}
				</View>
			</ToggleGroup>
		</Flex.Item>
	);
};

export default HelpTraySectionStages;
