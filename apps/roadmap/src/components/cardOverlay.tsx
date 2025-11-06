import {
	Dialog,
	Flex,
	Heading,
	IconButton,
	IconXLine,
	Img,
	List,
	Mask,
	Pill,
	Portal,
	Responsive,
	Text,
	View,
} from "@instructure/ui";
import type { FC } from "react";
import { useMemo } from "react";
import { getLinkType, getProductArea } from "../utils";
import { VideoPlayer } from "./";
import { Colors } from "./logos";

const CardOverlayContent: FC<{
	entry: PendoAPIFeature;
	isOpen: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isNarrow: boolean;
	isDark: boolean;
}> = ({ entry, isOpen, setOpen, isNarrow = false, isDark = false }) => {
	const { feature, product } = entry;
	const { links } = feature;

	const area = getProductArea(product.area);

	const Links = links?.map((link) => ({
		title: getLinkType(link),
		url: link.linkUrl,
	}));

	const video = useMemo(
		() => Links?.find((link) => link.title.toLowerCase() === "video")?.url,
		[Links],
	);
	const image = useMemo(
		() => Links?.find((link) => link.title.toLowerCase() === "image")?.url,
		[Links],
	);

	const handleClick = () => {
		setOpen(false);
	};

	return (
		<Portal open={isOpen}>
			<Mask
				placement="top"
				themeOverride={{ background: isDark ? "#0E1316" : "#F2F4F4" }}
			>
				<Dialog
					onDismiss={handleClick}
					open={isOpen}
					shouldContainFocus
					shouldReturnFocus
				>
					<Flex>
						<Flex.Item shouldGrow shouldShrink width="100vw">
							<View
								as="div"
								background={isDark ? "primary-inverse" : "primary"}
								borderColor={isDark ? "secondary" : "primary"}
								borderRadius="large"
								borderWidth="small"
								margin="xx-small"
								maxWidth="77.125rem"
								shadow={isDark ? "none" : "above"}
								themeOverride={{
									backgroundPrimaryInverse: "#171f24",
									borderColorPrimary: "#D7DADE",
									borderColorSecondary: "#2A353F",
								}}
							>
								<View
									as="div"
									borderColor={isDark ? "secondary" : "primary"}
									borderWidth="0 0 small"
									padding="0 0 small small"
									themeOverride={{
										borderColorPrimary: "#D7DADE",
										borderColorSecondary: "#2A353F",
									}}
								>
									<Flex alignItems="start" direction="column">
										<Flex.Item shouldGrow shouldShrink width="100%">
											<Flex direction="row">
												<Flex.Item shouldGrow shouldShrink>
													<product.logo inline valign="bottom" />{" "}
													<Text
														color={isDark ? "primary-inverse" : "secondary"}
														variant="contentSmall"
													>
														{product.name}
													</Text>
												</Flex.Item>
												<Flex.Item>
													<View as="div" padding="xx-small">
														<IconButton
															color={isDark ? "primary-inverse" : undefined}
															onClick={handleClick}
															screenReaderLabel="Close"
															size="small"
															withBackground={false}
															withBorder={false}
														>
															<IconXLine />
														</IconButton>
													</View>
												</Flex.Item>
											</Flex>
										</Flex.Item>
										<Flex.Item>
											<Heading
												level="h3"
												margin="0 0 small"
												variant="titleCardMini"
											>
												{feature.title}
											</Heading>
										</Flex.Item>
										<Flex.Item>
											<Flex direction="row" gap="xx-small" wrap="wrap">
												<Flex.Item>
													<Pill
														color={
															feature.stage === "Coming Soon"
																? "success"
																: "info"
														}
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
										</Flex.Item>
									</Flex>
								</View>
								<View as="div" padding="small">
									<Flex
										alignItems="start"
										direction={isNarrow ? "column" : "row"}
										gap="small"
										withVisualDebug
										wrap="wrap"
									>
										{video && (
											<Flex.Item
												shouldGrow
												shouldShrink
												width={isNarrow ? "100%" : "75"}
											>
												<View
													as="div"
													margin={isNarrow ? "small 0 0" : "large 0 0"}
												>
													<VideoPlayer url={video} />
												</View>
											</Flex.Item>
										)}
										{!video && image && (
											<Flex.Item width={isNarrow ? "100%" : "75%"}>
												<Img alt={feature.title} src={image} />
											</Flex.Item>
										)}
										<Flex.Item width={isNarrow ? "100%" : "25%"}>
											<View
												as="div"
												borderColor={isDark ? "secondary" : "primary"}
												borderWidth="0 0 small 0"
												themeOverride={{
													borderColorSecondary: "#2A353F",
												}}
											>
												<Heading
													level="h5"
													margin={isNarrow ? "0" : "large 0 large"}
													variant="titleCardRegular"
												>
													Product
												</Heading>
												<List isUnstyled>
													<List.Item
														themeOverride={{
															color: isDark ? "#fff" : undefined,
														}}
													>
														Name: {product.name}
													</List.Item>
													{area && (
														<List.Item
															themeOverride={{
																color: isDark ? "#fff" : undefined,
															}}
														>
															Area: {area}
														</List.Item>
													)}
												</List>
											</View>
											<View
												as="div"
												borderColor={isDark ? "secondary" : "primary"}
												borderWidth="0 0 small 0"
												themeOverride={{
													borderColorSecondary: "#2A353F",
												}}
											>
												<Heading
													level="h5"
													margin={isNarrow ? "small 0 0" : "large 0 large"}
													variant="titleCardRegular"
												>
													Feature
													<List isUnstyled>
														<List.Item
															themeOverride={{
																color: isDark ? "#fff" : undefined,
															}}
														>
															Stage: {feature.stage}
														</List.Item>
													</List>
												</Heading>
											</View>
										</Flex.Item>
										<Flex.Item>
											<Text as="p">{feature.description}</Text>
										</Flex.Item>
									</Flex>
								</View>
							</View>
						</Flex.Item>
					</Flex>
				</Dialog>
			</Mask>
		</Portal>
	);
};

const CardOverlay: FC<{
	entry: PendoAPIFeature;
	isOpen: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isDark: boolean;
}> = ({ entry, isOpen, setOpen, isDark = false }) => {
	return (
		<Responsive
			query={{ large: { minWidth: "50rem" }, small: { maxWidth: "50rem" } }}
			render={(_props, matches) => {
				const isSmall = matches?.includes("small") ?? false;
				return (
					<CardOverlayContent
						entry={entry}
						isDark={isDark}
						isNarrow={isSmall}
						isOpen={isOpen}
						setOpen={setOpen}
					/>
				);
			}}
		/>
	);
};

export default CardOverlay;
