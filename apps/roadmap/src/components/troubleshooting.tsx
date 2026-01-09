import {
  Heading,
  IconPlusSolid,
  IconXSolid,
  Link,
  List,
  Text,
  ToggleGroup,
  View,
} from "@instructure/ui";

const reload = () => {
  globalThis.location.reload();
};

interface ContentLinkProps {
  href: string;
  children: React.ReactNode;
  isDark: boolean;
  onClick?: () => void;
}

const focusInverseOutlineThemeOverride = { focusInverseOutlineColor: "#fff" };

const ContentLink = ({ href, children, isDark, onClick }: ContentLinkProps) => {
  let color: "link" | "link-inverse" = "link";
  if (isDark) {
    color = "link-inverse";
  }
  return (
    <Link
      color={color}
      href={href}
      target="_blank"
      themeOverride={focusInverseOutlineThemeOverride}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

interface TroubleshootingItem {
  content: (isDark: boolean) => React.ReactNode;
}

const troubleshootingItems: TroubleshootingItem[] = [
  {
    content: () => "Make sure you're not logged in with a site admin account.",
  },
  {
    content: () => "Make sure you're viewing the page in an iframe.",
  },
  {
    content: (isDark) => (
      <>
        Make sure{" "}
        <ContentLink href="/roadmap/themeEditor.js" isDark={isDark}>
          themeEditor.js
        </ContentLink>{" "}
        and{" "}
        <ContentLink href="/roadmap/themeEditor.css" isDark={isDark}>
          themeEditor.css
        </ContentLink>{" "}
        are installed in the current Account.
      </>
    ),
  },
  {
    content: () => (
      <>
        Make sure the iframe has a valid <Text as="code">data-roadmap</Text> attribute.
      </>
    ),
  },
  {
    content: (isDark) => (
      <>
        Make sure access to{" "}
        <ContentLink href="https://instructure.ai/roadmap" isDark={isDark}>
          instructure.ai/roadmap
        </ContentLink>{" "}
        is not blocked by a firewall.
      </>
    ),
  },
  {
    content: (isDark) => (
      <>
        Try{" "}
        <ContentLink href="#" isDark={isDark} onClick={reload}>
          reloading
        </ContentLink>{" "}
        the page.
      </>
    ),
  },
];

const lightThemeOverride = {};
const darkThemeOverride = { color: "#fff" };

const TroubleshootingList = ({ isDark }: { isDark: boolean }) => {
  let themeOverride = lightThemeOverride;
  if (isDark) {
    themeOverride = darkThemeOverride;
  }
  return (
    <>
      <Text as="p">If you don't see any roadmap items, here are some ways to troubleshoot:</Text>
      <List>
        {troubleshootingItems.map((item, idx) => {
          const content = item.content(false);
          let key = "";
          if (typeof content === "string") {
            key = content;
          } else {
            key = `item-${idx}`;
          }
          return (
            <List.Item key={key} themeOverride={themeOverride}>
              {item.content(isDark)}
            </List.Item>
          );
        })}
      </List>
    </>
  );
};

const summaryHeading = <Heading level="h2">Troubleshooting</Heading>;

const Troubleshooting = ({ isDark }: { isDark: boolean }) => (
  <ToggleGroup
    toggleLabel="Toggle Troubleshooting Tips"
    summary={summaryHeading}
    iconExpanded={IconXSolid}
    icon={IconPlusSolid}
    defaultExpanded
    border={false}
  >
    <View as="div" padding="0 medium">
      <TroubleshootingList isDark={isDark} />
    </View>
  </ToggleGroup>
);

export default Troubleshooting;
