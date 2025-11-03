import {
	Button,
	Flex,
	Heading,
	Pill,
	Text,
	TruncateText,
	View,
} from "@instructure/ui";
import { lighten } from "@instructure/ui-color-utils";
import type { FC } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Logos, { Colors } from "./logos";

const Card: FC<{
	entry: PendoAPIFeature;
	setSelectedEntry: React.Dispatch<
		React.SetStateAction<PendoAPIFeature | null>
	>;
	setOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isDark: boolean;
}> = ({ entry, setSelectedEntry, setOverlayOpen, isDark }) => {
	const [maxLines, setMaxLines] = useState(4);
	const headingEl = useRef<Element | null>(null);

	const { CardBackground } = Logos;

	const { feature, product } = entry;

	const recalc = useCallback(() => {
		const el = headingEl.current;
		if (!el) return;
		const style = window.getComputedStyle(el);
		const lineHeight = parseFloat(style.lineHeight || "0") || 1;
		const height = el.getBoundingClientRect().height;
		const lines = Math.max(1, Math.round(height / lineHeight));
		setMaxLines(lines > 1 ? 3 : 4);
	}, []);

	// Measure after layout (and when the title changes)
	useLayoutEffect(() => {
		recalc();
	}, [recalc]);

	// Recalculate on heading resize (e.g., wrapping due to width changes)
	useLayoutEffect(() => {
		const el = headingEl.current;
		if (!el || typeof ResizeObserver === "undefined") return;
		const ro = new ResizeObserver(() => recalc());
		ro.observe(el);
		return () => ro.disconnect();
	}, [recalc]);

	const handleClick = () => {
		setSelectedEntry(entry);
		setOverlayOpen(true);
	};

	return (
		<Flex.Item align="start" size="25rem">
			<View
				as="div"
				background={isDark ? "primary-inverse" : "primary"}
				borderColor={isDark ? "secondary" : "primary"}
				borderRadius="large"
				borderWidth="small"
				themeOverride={{
					backgroundPrimaryInverse: "#171f24",
					borderColorPrimary: "#D7DADE",
					borderColorSecondary: "#2A353F",
				}}
			>
				<Flex
					direction="column"
					gap="moduleElements"
					padding="paddingCardSmall"
				>
					<Flex.Item>
						<View
							as="div"
							borderRadius="large"
							height="10rem"
							overflowX="hidden"
							overflowY="hidden"
							position="relative"
						>
							<View
								as="div"
								borderRadius="large"
								height="100%"
								position="absolute"
								width="100%"
							>
								<CardBackground color={product.color} />
							</View>

							<View
								as="div"
								padding="paddingCardLarge 0 0 paddingCardLarge"
								position="relative"
							>
								<product.logo color="#fff" height="2rem" inline />
								<View margin="0 small 0">
									<Text color="secondary-inverse" variant="descriptionPage">
										{product.name}
									</Text>
								</View>
							</View>
						</View>
					</Flex.Item>
					<Flex.Item>
						<View as="div">
							<Flex direction="row" gap="xx-small" wrap="wrap">
								<Flex.Item>
									<Pill
										color={feature.stage === "Coming Soon" ? "success" : "info"}
										themeOverride={{
											background: isDark ? "#0E1316" : "#fff",
											infoColor: Colors.parchment,
											successColor: Colors.mastery,
										}}
									>
										<Text size="legend">{feature.stage}</Text>
									</Pill>
								</Flex.Item>
								{(() => {
									const areaParts = product.area?.split(" - ");
									return areaParts?.[1] ? (
										<Flex.Item>
											<Pill
												themeOverride={{
													background: isDark ? "#0E1316" : "#fff",
													primaryColor: "#9EA6AD",
												}}
											>
												<Text size="legend">{areaParts[1]}</Text>
											</Pill>
										</Flex.Item>
									) : null;
								})()}
							</Flex>
						</View>
					</Flex.Item>
					<Flex.Item>
						<View as="div" height="110px" overflowY="hidden">
							<Heading
								elementRef={(node) => {
									headingEl.current = node;
								}}
								level="h2"
								margin="0 0 moduleElements"
								variant="titleCardMini"
							>
								{feature.title}
							</Heading>
							<Text size="contentSmall">
								<TruncateText maxLines={maxLines} truncate="word">
									{feature.description}
								</TruncateText>
							</Text>
						</View>
					</Flex.Item>
					<Flex.Item>
						<View as="div" padding="xx-small">
							<Button
								color={isDark ? "primary-inverse" : "secondary"}
								display="block"
								onClick={handleClick}
								textAlign="center"
								themeOverride={{
									borderRadius: "0.5rem",
									primaryInverseBackground: "#2A353F",
									primaryInverseBorderColor: "transparent",
									primaryInverseColor: "#fff",
									primaryInverseHoverBackground: lighten("#2A353F", 5),
									secondaryBorderColor: "transparent",
								}}
							>
								Details
							</Button>
						</View>
					</Flex.Item>
				</Flex>
			</View>
		</Flex.Item>
	);
};

export default Card;
