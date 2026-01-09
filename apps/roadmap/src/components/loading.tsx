// oxlint-disable jsx-max-depth
// oxlint-disable jsx-no-new-object-as-prop
// oxlint-disable no-ternary
import { Heading, Link, Text, View } from "@instructure/ui";
import { ThemeEditor, Troubleshooting } from "./";

const Loading = ({ isDark }: { isDark: boolean }) => (
  <View
    as="div"
    background={isDark ? "primary-inverse" : "primary"}
    borderColor={isDark ? "secondary" : "primary"}
    borderRadius="1rem"
    borderWidth="small"
    color={isDark ? "primary-inverse" : "primary"}
    padding="medium"
    themeOverride={{
      backgroundPrimaryInverse: "#171f24",
      borderColorSecondary: "#2A353F",
    }}
  >
    <Heading
      color={isDark ? "primary-inverse" : "primary"}
      level="h1"
      variant="titleCardSection"
      margin="0 0 small"
    >
      Instructure Roadmap
    </Heading>
    <Text as="p">
      This tool embeds entries from the{" "}
      <Link href="https://roadmap.instructure.com" target="_blank">
        Instructure Roadmap
      </Link>{" "}
      in a Canvas sandbox.
    </Text>
    <Troubleshooting isDark={isDark} />
    <ThemeEditor isDark={isDark} />
  </View>
);

export default Loading;
