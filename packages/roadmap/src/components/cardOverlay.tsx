import {
	Flex,
	Heading,
	IconButton,
	IconCanvasLogoLine,
	IconXSolid,
	Img,
	Link,
	Modal,
	Text,
	View,
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
	const community = links?.find((link) => link.title === "community")?.linkUrl;
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
				<View overflowX="hidden" withFocusOutline={false}>
					<Flex direction="row" gap="none" alignItems="start">
						<Flex.Item shouldGrow shouldShrink>
							<View as="div" margin="0 large 0 0">
							{video ? (
								<VideoPlayer url={video} />
							) : image ? (
								<Img alt={feature.title} src={image} />
							) : null}
							<Text size="content">
								{feature.description}
								<br />
								{community && <Link href={community}>Learn more</Link>}
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
