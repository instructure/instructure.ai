import { View } from "@instructure/ui";
const VideoPlayer = ({ url }: { url: string | undefined }) => {
  return url ? (
    <View as="div" textAlign="center" margin="0 0 medium">
      <iframe
        style={{ border: "none" }}
        src={url}
        width="80%"
        height="500px"
        title="Video Player"
        allowFullScreen
      ></iframe>
    </View>
  ) : undefined;
};

export default VideoPlayer;