import { View } from "@instructure/ui";

const VideoPlayer = ({ url }: { url: string | undefined }) => {
	return url ? (
		<View as="div" margin="0 0 small" textAlign="center">
			<iframe
				allowFullScreen
				height="500px"
				src={url}
				style={{ border: "none" }}
				title="Video Player"
				width="100%"
			></iframe>
		</View>
	) : undefined;
};

export default VideoPlayer;
