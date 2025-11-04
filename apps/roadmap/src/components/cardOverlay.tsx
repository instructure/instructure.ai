import {
	Flex,
	Heading,
	IconButton,
	IconXLine,
	Mask,
	Pill,
	Portal,
	Responsive,
	Text,
	View,
} from "@instructure/ui";
import type { FC } from "react";
import { useMemo } from "react";
import { getLinkType } from "../utils";
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

	const Links = links?.map((link) => ({
		title: getLinkType(link),
		url: link.linkUrl,
	}));

	const _video = useMemo(
		() => Links?.find((link) => link.title.toLowerCase() === "video")?.url,
		[Links],
	);
	const _image = useMemo(
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
				<View
					as="div"
					background={isDark ? "primary-inverse" : "primary"}
					borderColor={isDark ? "secondary" : "primary"}
					borderRadius="large"
					borderWidth="small"
					margin={isDark ? "none" : "xx-small"}
					shadow={isDark ? "none" : "above"}
					themeOverride={{
						backgroundPrimaryInverse: "#171f24",
						borderColorPrimary: "#D7DADE",
						borderColorSecondary: "#2A353F",
					}}
					width="100%"
				>
					<View
						as="div"
						borderColor={isDark ? "secondary" : "primary"}
						borderWidth="0 0 small"
						padding="small"
						themeOverride={{
							borderColorPrimary: "#D7DADE",
							borderColorSecondary: "#2A353F",
						}}
					>
						<Flex alignItems="start" direction="column">
							<Flex.Item shouldGrow shouldShrink width="100%">
								<Flex direction="row">
									<Flex.Item shouldGrow shouldShrink>
										<product.logo inline />{" "}
										<Text
											color={isDark ? "primary-inverse" : "secondary"}
											variant="contentSmall"
										>
											{product.name}
										</Text>
									</Flex.Item>
									<Flex.Item>
										<View>
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
								<Heading margin="0 0 small" variant="titleCardMini">
									{feature.title}
								</Heading>
							</Flex.Item>
							<Flex.Item>
								<Flex direction="row" gap="xx-small" wrap="wrap">
									<Flex.Item>
										<Pill
											color={
												feature.stage === "Coming Soon" ? "success" : "info"
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
						Bottom
					</View>
				</View>
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
