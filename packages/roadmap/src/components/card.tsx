import type { FC } from 'react';
import { useState } from 'react';
import { Heading, Text, Flex, TruncateText, View, Pill,IconCanvasLogoLine } from '@instructure/ui';

const Card: FC<{ entry: PendoAPIFeature }> = ({ entry }) => {
  const [isFocused, setFocused] = useState(false);
  const [isHovered, setHovered] = useState(false);

  const { feature, product } = entry;

  const shadow = isFocused || isHovered ? 'above' : 'resting';

  const handleFocus = () => {
    setFocused(!isFocused);
    setHovered(!isHovered);
  };

  return (
    <Flex.Item align="start" size="21rem" shouldGrow shouldShrink>
      <View as="div" padding="x-small">
        <View
          as="div"
          tabIndex={0}
          shouldAnimateFocus
          borderColor="secondary"
          borderWidth="small"
          shadow={shadow}
          borderRadius="medium"
          onFocus={handleFocus}
          onBlur={handleFocus}
          onMouseEnter={handleFocus}
          onMouseLeave={handleFocus}
        >
          <Flex direction="column" gap="moduleElements" height="15rem">
            <Flex.Item>
              <View as="div" borderWidth="0 0 small 0" borderColor="secondary" padding="moduleElements">
                <Flex gap="small">
                  <Flex.Item>
                    <IconCanvasLogoLine size="x-small" color="error" />
                  </Flex.Item>
                  <Flex.Item shouldGrow shouldShrink>
                    <Heading variant="titleCardMini" level="h2">
                      <TruncateText maxLines={1}>{feature.title}</TruncateText>
                    </Heading>
                  </Flex.Item>
                </Flex>
              </View>
            </Flex.Item>
            <Flex.Item shouldGrow shouldShrink>
              <View as="div" padding="0 small">
            <Text size="contentSmall">
              <TruncateText maxLines={4} truncate="word">
                {feature.description}
              </TruncateText>
            </Text>
            </View>
          </Flex.Item>
          <Flex.Item>
            <View as="div" padding="moduleElements" background="secondary">
              <Flex gap="xx-small" direction="row" wrap="wrap">
                <Flex.Item>
                  <Pill color={feature.stage === "Coming Soon" ? "success" : "info"}><Text size="legend">{feature.stage}</Text></Pill>
                </Flex.Item>
                <Flex.Item>
                  <Pill><Text size="legend">{product.area?.split(" - ")[1]}</Text></Pill>
                </Flex.Item>
              </Flex>
            </View>
          </Flex.Item>
        </Flex>
      </View>
      </View>
    </Flex.Item>
  );
};

export default Card;