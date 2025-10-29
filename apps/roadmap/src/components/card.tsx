import { Flex, Heading, Pill, Text, TruncateText, View } from "@instructure/ui";
import type { FC } from "react";

const Card: FC<{
	entry: PendoAPIFeature;
	setSelectedEntry: React.Dispatch<
		React.SetStateAction<PendoAPIFeature | null>
	>;
	setOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ entry, setSelectedEntry, setOverlayOpen }) => {

	const { feature, product } = entry;

	const handleClick = () => {
		setSelectedEntry(entry);
		setOverlayOpen(true);
	};

	return (
		<Flex.Item align="start" size="25rem">
			<View as="div" padding="x-small">
				<View
					as="div"
					background="primary"
					borderRadius="large"
					onClick={handleClick}
					shouldAnimateFocus
					tabIndex={0}
				>
					<Flex direction="column" gap="moduleElements">
						<Flex.Item>
							<View as="div" themeOverride={{backgroundSecondary: product.color}} background="secondary" borderRadius="large large 0 0" height="10rem" padding="medium 0 0 medium">
								<product.logo height="1.25rem" inline />
								{" "}
								<Text variant="contentImportant">{product.name}</Text>
							</View>
						</Flex.Item>
						<Flex.Item>
							<View as="div" padding="moduleElements">
								<Flex direction="row" gap="xx-small" wrap="wrap">
									<Flex.Item>
										<Pill
											color={
												feature.stage === "Coming Soon" ? "success" : "info"
											}
										>
											<Text size="legend">{feature.stage}</Text>
										</Pill>
									</Flex.Item>
									<Flex.Item>
										<Pill>
											<Text size="legend">{product.area?.split(" - ")[1]}</Text>
										</Pill>
									</Flex.Item>
								</Flex>
							</View>
						</Flex.Item>
						<Flex.Item>
							<View
								as="div"
								borderColor="primary"
								borderWidth="0 0 small 0"
								padding="moduleElements"
							>
								<Heading level="h2" variant="titleCardMini">
									<TruncateText maxLines={1}>{feature.title}</TruncateText>
								</Heading>
							</View>
						</Flex.Item>
						<Flex.Item shouldGrow shouldShrink>
							<View as="div" padding="0 small">
								<Text size="contentSmall">
									<TruncateText maxLines={4} truncate="word">
										{feature.description}
									</TruncateText>
								</Text>
							</View>
						</Flex.Item>
					</Flex>
				</View>
			</View>
		</Flex.Item>
	);
};

export default Card;
