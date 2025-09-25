import { Heading, Modal, CloseButton, View, Text, IconCanvasLogoLine, Flex, Link } from "@instructure/ui";
import type { FC } from "react";
import { VideoPlayer } from "./";

const CardOverlay: FC<{
	entry: PendoAPIFeature;
	isOpen: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ entry, isOpen, setOpen }) => {

	const { feature } = entry;

	const { links } = feature;

	const video = links?.find(link => link.title === "video")?.linkUrl;
	const community = links?.find(link => link.title === "community")?.linkUrl;

	return (
		<Modal
			label="Feature Details"
			onDismiss={() => setOpen(false)}
			size="fullscreen"
			open={isOpen}
		>
			<Modal.Header>
				<Flex direction="row" gap="x-small">
					<Flex.Item>
						<IconCanvasLogoLine color="error" size="small" />
						</Flex.Item>
					<Flex.Item>
				<Heading>{feature.title}</Heading>

        <CloseButton
          placement="end"
					size="medium"
          onClick={() => setOpen(false)}
          screenReaderLabel="Close"
        />
				</Flex.Item>
				</Flex>
			</Modal.Header>
			<Modal.Body>
				<View overflowX="hidden" withFocusOutline={false}>
					{video && <VideoPlayer url={video} />}
						<Text size="content">
							{feature.description}
							<br />
							{ community && <Link href={community} >Learn more</Link> }
						</Text>
				</View>
			</Modal.Body>
		</Modal>
	);
};

export default CardOverlay;
