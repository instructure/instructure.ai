import type { FC } from 'react';
import { Heading, Text, Flex, TruncateText } from '@instructure/ui';

const Card: FC<{ entry: PendoAPIFeature }> = ({ entry }) => {
  return (
    <Flex.Item align="start" padding="paddingCardSmall" size="300px" withVisualDebug shouldGrow>
      <Flex direction="column" withVisualDebug>
        <Flex.Item>
          <Heading level="h4" as="h3"><TruncateText maxLines={1}>{entry.feature.title}</TruncateText></Heading>
        </Flex.Item>
        <Flex.Item>
          <Text as="p"><TruncateText maxLines={4} truncate="word">{entry.feature.description}</TruncateText></Text>
        </Flex.Item>
        <Flex.Item>
          <Text as="p">{entry.product.name}</Text>
        </Flex.Item>
      </Flex>
    </Flex.Item>
  );
};

export default Card;