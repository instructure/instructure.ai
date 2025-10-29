import { Flex, Heading, Pill, Text, TruncateText, View, Button } from "@instructure/ui"
import type { FC } from "react"
import { useLayoutEffect, useRef, useState } from "react"

const Card: FC<{
  entry: PendoAPIFeature
  setSelectedEntry: React.Dispatch<React.SetStateAction<PendoAPIFeature | null>>
  setOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ entry, setSelectedEntry, setOverlayOpen }) => {
  const [maxLines, setMaxLines] = useState(4)
  const headingEl = useRef<Element | null>(null)

  const { feature, product } = entry

  const recalc = () => {
    const el = headingEl.current
    if (!el) return
    const style = window.getComputedStyle(el)
    const lineHeight = parseFloat(style.lineHeight || "0") || 1
    const height = el.getBoundingClientRect().height
    const lines = Math.max(1, Math.round(height / lineHeight))
    setMaxLines(lines > 1 ? 3 : 4)
  }

  // Measure after layout (and when the title changes)
  useLayoutEffect(() => {
    recalc()
  }, [feature.title])

  // Recalculate on heading resize (e.g., wrapping due to width changes)
  useLayoutEffect(() => {
    const el = headingEl.current
    if (!el || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(() => recalc())
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleClick = () => {
    setSelectedEntry(entry)
    setOverlayOpen(true)
  }

  return (
    <Flex.Item align="start" size="25rem">
      <View as="div" padding="x-small">
        <View
          as="div"
          background="primary"
          borderRadius="large"
          onClick={handleClick}
          shouldAnimateFocus
          tabIndex={0}
        >
          <Flex direction="column" gap="moduleElements" padding="moduleElements">
            <Flex.Item>
              <View
                as="div"
                themeOverride={{ backgroundSecondary: product.color }}
                background="secondary"
                borderRadius="large"
                height="10rem"
                padding="moduleElements"
              >
                <product.logo height="1.25rem" inline color="#fff" />{" "}
                <Text variant="contentImportant" color="secondary-inverse">
                  {product.name}
                </Text>
              </View>
            </Flex.Item>

            <Flex.Item>
              <View as="div">
                <Flex direction="row" gap="xx-small" wrap="wrap">
                  <Flex.Item>
                    <Pill color={feature.stage === "Coming Soon" ? "success" : "info"}>
                      <Text size="legend">{feature.stage}</Text>
                    </Pill>
                  </Flex.Item>
                  <Flex.Item>
                    <Pill>
                      <Text size="legend">{product.area?.split(" - ")[1]}</Text>
                    </Pill>
                  </Flex.Item>
                </Flex>
              </View>
            </Flex.Item>

            <Flex.Item>
              <View as="div" overflowY="hidden" height="110px">
                <Heading
                  level="h2"
                  variant="titleCardMini"
                  margin="0 0 moduleElements"
                  elementRef={(node) => {
                    headingEl.current = node
                  }}
                >
                  {feature.title}
                </Heading>

                <Text size="contentSmall">
                  <TruncateText maxLines={maxLines} truncate="word">
                    {feature.description}
                  </TruncateText>
                </Text>
              </View>
            </Flex.Item>

            <Flex.Item>
              <Button
                display="block"
                textAlign="center"
                color="secondary"
                onClick={handleClick}
                themeOverride={{ borderRadius: "0.5rem", secondaryBorderColor: "transparent" }}
              >
                Details
              </Button>
            </Flex.Item>
          </Flex>
        </View>
      </View>
    </Flex.Item>
  )
}

export default Card
