import { Flex, Heading, Link, List, Text, View } from "@instructure/ui";
import type { FC } from "react";
import { getLinkType } from "../utils";

const TagList: FC<{ entry: PendoAPIFeature; isNarrow: boolean }> = ({
  entry,
  isNarrow = false,
}) => {
  const { feature, product } = entry;
  return (
    <View as="div" minWidth="10rem">
      <Flex
        alignItems="start"
        direction={isNarrow ? "row" : "column"}
        gap="small"
      >
        <Flex.Item shouldGrow shouldShrink width="100%">
          <Heading
            border={isNarrow ? "none" : "bottom"}
            margin="0 0 small 0"
            variant="titleCardRegular"
          >
            Product
          </Heading>
          <List isUnstyled margin="0">
            <List.Item>
              <Text variant="contentImportant">Name:</Text> {product.name}
            </List.Item>
            {product.area && (
              <List.Item>
                <Text variant="contentImportant">Area:</Text>{" "}
                {product.area.split("-")[1] ?? product.area}
              </List.Item>
            )}
          </List>
        </Flex.Item>
        <Flex.Item shouldGrow shouldShrink width="100%">
          <Heading
            border={isNarrow ? "none" : "bottom"}
            margin="0 0 small 0"
            variant="titleCardRegular"
          >
            Feature
          </Heading>
          <List isUnstyled margin="0">
            {feature.stage && (
              <List.Item>
                <Text variant="contentImportant">Stage:</Text> {feature.stage}
              </List.Item>
            )}
            {feature.links?.length && (
              <>
                <Text variant="contentImportant">Links:</Text>
                <List>
                  {feature.links
                    .map((link) => ({
                      ...link,
                      type: getLinkType(link),
                    }))
                    .filter(
                      (link) => link.type !== "image" && link.type !== "video",
                    )
                    .map((link) => (
                      <List.Item key={link.linkUrl}>
                        <Link
                          href={link.linkUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <Text transform="capitalize">{link.type}</Text>
                        </Link>
                      </List.Item>
                    ))}
                </List>
              </>
            )}
          </List>
        </Flex.Item>
      </Flex>
    </View>
  );
};

export default TagList;
