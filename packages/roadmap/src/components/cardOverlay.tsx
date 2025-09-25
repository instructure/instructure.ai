import {
	Flex,
	Heading,
	IconButton,
	IconXSolid,
	Img,
	Modal,
	Pill,
	Responsive,
	Text,
	View,
} from "@instructure/ui";
import type { FC } from "react";
import { TagList, VideoPlayer } from "./";

const CardOverlayContent: FC<{
	entry: PendoAPIFeature;
	isOpen: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isNarrow: boolean;
}> = ({ entry, isOpen, setOpen, isNarrow = false }) => {
	const { feature, product } = entry;
	const { links } = feature;

	const video = links?.find((link) => link.title === "video")?.linkUrl;
	const image = links?.find((link) => link.title === "image")?.linkUrl;

	return (
		<Modal
			label="Feature Details"
			onDismiss={() => setOpen(false)}
			open={isOpen}
			size="fullscreen"
		>
			<Modal.Header>
				<Flex alignItems="center" direction="row" gap="x-small" wrap="no-wrap">
					{product.logo && (
						<Flex.Item>
							<product.logo height="2.5rem" />
						</Flex.Item>
					)}

					<Flex.Item shouldGrow shouldShrink>
						<Heading variant="titleCardLarge">{feature.title}</Heading>
					</Flex.Item>
					<Flex.Item>
						<IconButton
							onClick={() => setOpen(false)}
							screenReaderLabel="Close"
							withBackground={false}
							withBorder={false}
						>
							<IconXSolid />
						</IconButton>
					</Flex.Item>
				</Flex>
			</Modal.Header>
			<Modal.Body>
				<View id="overlay" overflowX="hidden" withFocusOutline={false}>
					<Flex
						alignItems="start"
						direction="row"
						gap="medium"
						wrap={isNarrow ? "wrap-reverse" : "no-wrap"}
					>
						<Flex.Item shouldShrink>
							<View as="div">
								{video ? (
									<VideoPlayer url={video} />
								) : image ? (
									<Img alt={feature.title} src={image} />
								) : null}
								{feature.labels?.length && (
									<View as="div" margin="0 0 small">
										{feature.labels.map((label) => (
											<Pill key={label} margin="x-small x-small 0 0">
												{label}
											</Pill>
										))}
									</View>
								)}
								<Text variant="content">{feature.description}</Text>
							</View>
						</Flex.Item>
						<Flex.Item>
							<TagList entry={entry} isNarrow={isNarrow} />
						</Flex.Item>
					</Flex>
				</View>
			</Modal.Body>
		</Modal>
	);
};

const CardOverlay: FC<{
	entry: PendoAPIFeature;
	isOpen: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ entry, isOpen, setOpen }) => {
	return (
		<Responsive
			query={{ large: { minWidth: "50rem" }, small: { maxWidth: "50rem" } }}
			render={(_props, matches) => {
				const isSmall = Array.isArray(matches)
					? matches.includes("small")
					: false;
				return (
					<CardOverlayContent
						entry={entry}
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
