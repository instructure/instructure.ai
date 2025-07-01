import { Badge } from "@instructure/ui-badge";
import { Flex } from "@instructure/ui-flex";
import { Heading } from "@instructure/ui-heading";
import { Link } from "@instructure/ui-link";
import { List } from "@instructure/ui-list";
import { Popover } from "@instructure/ui-popover";
import { Text } from "@instructure/ui-text";
import { ToggleGroup } from "@instructure/ui-toggle-details";
import { View } from "@instructure/ui-view";
import type { FC } from "react";
import Stages, { type Stage } from "../assets/Stages";

const HelpTraySectionStages: FC = () => {
	const toggleHeader = (
		<Heading as="h3" level="h4">
			Product Stages
		</Heading>
	);

	return (
		<Flex.Item>
			<ToggleGroup
				defaultExpanded={true}
				size="small"
				summary={toggleHeader}
				toggleLabel="Product development definitions"
			>
				<View as="div" padding="0 small">
					<List delimiter="solid" isUnstyled margin="0" size="small">
						{Stages.map((stage: Stage) => (
							<List.Item key={stage.name} padding="small 0">
								<Badge
									margin="0 x-small xxx-small 0"
									standalone
									themeOverride={{ colorPrimary: stage.color }}
									type="notification"
								/>
								<Text as="dfn" size="small">
									{stage.name}:
								</Text>{" "}
								(
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
								</Popover>
								) {stage.description}
							</List.Item>
						))}
					</List>
				</View>
			</ToggleGroup>{" "}
		</Flex.Item>
	);
};

export default HelpTraySectionStages;
