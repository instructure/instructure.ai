import { Flex, Heading, Pill, Text, TruncateText, View } from "@instructure/ui";
import type { FC } from "react";
import { useState } from "react";

const Card: FC<{
	entry: PendoAPIFeature;
	setSelectedEntry: React.Dispatch<
		React.SetStateAction<PendoAPIFeature | null>
	>;
	setOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ entry, setSelectedEntry, setOverlayOpen }) => {
	const [isFocused, setFocused] = useState(false);
	const [isHovered, setHovered] = useState(false);

	const { feature, product } = entry;

	const shadow = isFocused || isHovered ? "above" : "resting";

	const handleFocusIn = () => {
		setFocused(true);
		setHovered(true);
	};

	const handleFocusOut = () => {
		setFocused(false);
		setHovered(false);
	};

	const handleClick = () => {
		setSelectedEntry(entry);
		setOverlayOpen(true);
	};

	return (
		<Flex.Item align="start" size="25rem">
			<View as="div" padding="x-small">
				<View
					as="div"
					borderColor="primary"
					borderRadius="large"
					borderWidth="small"
					onBlur={handleFocusOut}
					onClick={handleClick}
					onFocus={handleFocusIn}
					onKeyDown={(e) => {
						if (e.code === "Space" || e.key === "Enter") {
							e.preventDefault();
							handleClick();
						}
					}}
					onMouseEnter={handleFocusIn}
					onMouseLeave={handleFocusOut}
					shadow={shadow}
					shouldAnimateFocus
					tabIndex={0}
				>
					<Flex direction="column" gap="moduleElements" height="16rem">
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
						<Flex.Item padding="0 0 0 small">
							<Flex alignItems="center" direction="row" gap="xx-small">
								<Flex.Item>
									<View as="div" margin="xx-small 0 0">
										<product.logo height="1.25rem" inline />
									</View>
								</Flex.Item>
								<Flex.Item>
									<Text variant="contentImportant">{product.name}</Text>
								</Flex.Item>
							</Flex>
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
					</Flex>
				</View>
			</View>
		</Flex.Item>
	);
};

export default Card;
