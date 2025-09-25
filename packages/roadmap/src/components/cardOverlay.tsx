import {
	Flex,
	Heading,
	IconButton,
	IconCanvasLogoLine,
	IconXSolid,
	Img,
	Modal,
	Text,
	View,
	Pill
} from "@instructure/ui";
import type { FC } from "react";
import { VideoPlayer, TagList } from "./";

const CardOverlay: FC<{
	entry: PendoAPIFeature;
	isOpen: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ entry, isOpen, setOpen }) => {
	const { feature } = entry;
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
				<Flex direction="row" gap="x-small">
					<Flex.Item>
						<IconCanvasLogoLine color="error" size="small" />
					</Flex.Item>
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
				<View overflowX="hidden" withFocusOutline={false} id="overlay">
					<Flex direction="row" gap="medium" alignItems="start">
						<Flex.Item shouldGrow shouldShrink>
							<View as="div">
							{video ? (
								<VideoPlayer url={video} />
							) : image ? (
								<Img alt={feature.title} src={image} />
							) : null}
							{feature.labels?.length && <View as="div" margin="0 0 small">{feature.labels.map((label) => (
								<Pill key={label} margin="x-small 0 0">{label}</Pill>
							))}</View>}
							<Text variant="content">
								{feature.description}
							</Text>
							</View>
						</Flex.Item>
						<Flex.Item>
							<TagList entry={entry} />
						</Flex.Item>
					</Flex>
				</View>
			</Modal.Body>
		</Modal>
	);
};

export default CardOverlay;
