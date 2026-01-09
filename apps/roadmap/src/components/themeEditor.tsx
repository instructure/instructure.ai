import {
  ColorIndicator,
  ColorPicker,
  Flex,
  type FormMessageType,
  Heading,
  IconButton,
  IconCopyLine,
  IconDocumentLine,
  IconPlusSolid,
  IconXSolid,
  Img,
  Text,
  ToggleGroup,
  View,
} from "@instructure/ui";
import { useCallback, useState } from "react";
import { DownloadLink } from "./";
import faviconUrl from "../assets/images/favicon.ico";
import { lighten } from "@instructure/ui-color-utils";
import loginBackgroundImage from "../assets/images/loginBackgroundImage.png";
import loginLogo from "../assets/images/loginLogo.svg";
import mobileHomescreenIconUrl from "../assets/images/mobileHomescreenIcon.png";
import navLogoUrl from "../assets/images/navLogo.svg";
import responsiveGlobalNavLogoUrl from "../assets/images/responsiveGlobalNavLogo.svg";
import windowsTileWideUrl from "../assets/images/windowsTileWide.png";

const CopyValue = ({ value }: { value: string }) => {
  const handleCopy = useCallback(async () => {
    try {
      await globalThis.navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  }, [value]);

  return (
    <IconButton onClick={handleCopy} screenReaderLabel={`Copy value ${value}`} size="small">
      <IconCopyLine />
    </IconButton>
  );
};

const SimpleColor = ({ color }: { color: string }) => (
  <View as="div" margin="0 0 0 x-small">
    <ColorIndicator color={color} shape="circle" />
  </View>
);

const invalidColorMessage = (_hexCode: string) => [
  { text: "Please enter a valid hex color code.", type: "error" as FormMessageType },
];

const ComplexColor = ({
  label,
  color,
  onChange,
}: {
  label: string;
  color: string;
  onChange: (value: string) => void;
}) => (
  <>
    <Flex.Item width={200}>{label}</Flex.Item>
    <Flex.Item width={280}>
      <ColorPicker
        label=""
        value={color.toUpperCase()}
        aria-label="Color Picker"
        placeholderText="09508C"
        onChange={onChange}
        renderInvalidColorMessage={invalidColorMessage}
      />
    </Flex.Item>
    <Flex.Item>
      <CopyValue value={color} />
    </Flex.Item>
  </>
);

const ColorRow = ({ label, color }: { label: string; color: string }) => (
  <>
    <Flex.Item width={200}>{label}</Flex.Item>
    <Flex.Item>
      <SimpleColor color={color} />
    </Flex.Item>
    <Flex.Item width={240}>
      {" "}
      <Text as="code">{color}</Text>{" "}
    </Flex.Item>
    <Flex.Item>
      <CopyValue value={color} />
    </Flex.Item>
  </>
);

const LinkRow = ({ href, label, name }: { href: string; label: string; name: string }) => {
  const allowedTypes = ["svg", "png", "ico", "css", "js"] as const;
  const ext = name.split(".").pop();

  const isAllowedType = (value: string | undefined): value is (typeof allowedTypes)[number] =>
    typeof value === "string" && (allowedTypes as readonly string[]).includes(value);

  let type: (typeof allowedTypes)[number] = "png";
  if (isAllowedType(ext)) {
    type = ext;
  }

  const Display = ({ ext }: { ext: string }) => {
    switch (ext) {
      case "svg":
      case "png": {
        return <Img src={href} width={28} height="auto" />;
      }
      default: {
        return <IconDocumentLine title={`${ext.toUpperCase()} File`} />;
      }
    }
  };

  return (
    <>
      <Flex.Item width={200}>{label}</Flex.Item>
      <Flex.Item width={32}>
        <View as="div" margin="0 0 0 xx-small">
          {/* oxlint-disable-next-line jsx-max-depth */}
          <Display ext={ext ?? ""} />
        </View>
      </Flex.Item>
      <Flex.Item width={240}>
        <Text as="code">{name}</Text>
      </Flex.Item>
      <Flex.Item>
        <DownloadLink href={href} filename={name} type={type} />
      </Flex.Item>
    </>
  );
};

interface ThemeEditorItem {
  content: ({
    isDark,
    color,
    href,
    label,
    name,
  }: {
    isDark: boolean;
    color?: string;
    href?: string;
    label?: string;
    name?: string;
  }) => React.ReactNode;
}

const SINGLE_HEX_LENGTH = 1;
const HEX_RADIX = 16;

const toHex = (color: number) => {
  const hex = color.toString(HEX_RADIX);
  if (hex.length === SINGLE_HEX_LENGTH) {
    return `0${hex}`;
  } else {
    return hex;
  }
};

const RED_INDEX = 1;
const GREEN_INDEX = 2;
const BLUE_INDEX = 3;

const rgbToColors: (rgb: string) => { red: number; green: number; blue: number } = (rgb) => {
  const result = /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/.exec(rgb);
  if (!result) {
    throw new Error(`Invalid RGB color: ${rgb}`);
  }
  return {
    blue: parseInt(result[BLUE_INDEX], 10),
    green: parseInt(result[GREEN_INDEX], 10),
    red: parseInt(result[RED_INDEX], 10),
  };
};

const rgbToHex = (red: number, green: number, blue: number) =>
  `#${toHex(red)}${toHex(green)}${toHex(blue)}`;

const ThemeEditorList = ({ isDark }: { isDark: boolean }) => {
  const [primary, setPrimary] = useState("#09508C");
  const COLORS = {
    loginBackground: "#061C30",
    mainTextColor: "#273540",
    navBackground: "#F2F4F4",
    primaryBrandColor: primary,
    primaryButtonText: "#FFFFFF",
    secondaryButton: "#D8E2EE",
    secondaryButtonText: "#0C294A",
  };

  const LIGHTEN_PERCENTAGE = 10;

  const handlePrimaryChange = useCallback((value: string) => setPrimary(value.toUpperCase()), []);

  const themeEditorItems: ThemeEditorItem[] = [
    {
      content: () => <Heading level="h3">Global Branding</Heading>,
    },
    {
      content: ({ label = "Primary Brand Color:" }) => (
        <ComplexColor label={label} color={primary} onChange={handlePrimaryChange} />
      ),
    },
    {
      content: ({ color = COLORS.mainTextColor, label = "Main Text Color:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ color = COLORS.primaryBrandColor, label = "Link Color:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ color = COLORS.primaryBrandColor, label = "Primary Button:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ color = COLORS.primaryButtonText, label = "Primary Button Text:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ color = COLORS.secondaryButton, label = "Secondary Button:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: () => <Heading level="h3">Global Navigation</Heading>,
    },
    {
      content: ({ color = COLORS.navBackground, label = "Nav Background:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ color = COLORS.secondaryButtonText, label = "Nav Icon:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ color = COLORS.secondaryButtonText, label = "Nav Icon Active:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ color = COLORS.secondaryButtonText, label = "Nav Text:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ color = COLORS.secondaryButtonText, label = "Nav Text Active:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ color = COLORS.navBackground, label = "Nav Avatar Border:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ color = COLORS.primaryBrandColor, label = "Nav Badge:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ color = COLORS.navBackground, label = "Nav Logo Background:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ color = COLORS.primaryBrandColor, label = "Nav Badge Active:" }) => {
        if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
          const rgb = lighten(color, LIGHTEN_PERCENTAGE);
          if (rgb.startsWith("rgb(")) {
            const { red, green, blue } = rgbToColors(rgb);
            const hex = rgbToHex(red, green, blue).toUpperCase();
            return <ColorRow label={label} color={hex} />;
          }
        }
        return <ColorRow label={label} color={color} />;
      },
    },
    {
      content: ({ color = COLORS.primaryButtonText, label = "Nav Badge Text:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ color = COLORS.navBackground, label = "Nav Badge Text Active:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({ href = navLogoUrl, label = "Nav Badge Text Active:", name = "navLogo.svg" }) => (
        <LinkRow href={href} label={label} name={name} />
      ),
    },
    {
      content: ({
        href = responsiveGlobalNavLogoUrl,
        label = "Nav Badge Text Active:",
        name = "responsiveGlobalNavLogo.svg",
      }) => <LinkRow href={href} label={label} name={name} />,
    },
    {
      content: () => <Heading level="h3">Watermarks & Other Images</Heading>,
    },
    {
      content: ({ href = faviconUrl, label = "Favicon:", name = "favicon.ico" }) => (
        <LinkRow href={href} label={label} name={name} />
      ),
    },
    {
      content: ({
        href = mobileHomescreenIconUrl,
        label = "Mobile Homescreen Icon:",
        name = "mobileHomescreenIcon.png",
      }) => <LinkRow href={href} label={label} name={name} />,
    },
    {
      content: ({ color = COLORS.primaryBrandColor, label = "Windows Tile Color:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({
        href = windowsTileWideUrl,
        label = "Windows Tile Wide:",
        name = "windowsTileWide.png",
      }) => <LinkRow href={href} label={label} name={name} />,
    },
    {
      content: () => <Heading level="h3">Login Screen</Heading>,
    },
    {
      content: ({ color = COLORS.loginBackground, label = "Background Color:" }) => (
        <ColorRow label={label} color={color} />
      ),
    },
    {
      content: ({
        href = loginBackgroundImage,
        label = "Background Image:",
        name = "loginBackgroundImage.png",
      }) => <LinkRow href={href} label={label} name={name} />,
    },
    {
      content: ({ href = loginLogo, label = "Login Logo:", name = "loginLogo.svg" }) => (
        <LinkRow href={href} label={label} name={name} />
      ),
    },
    {
      content: () => <Heading level="h3">Upload</Heading>,
    },
    {
      content: ({
        href = "/roadmap/themeEditor.css",
        label = "CSS File:",
        name = "themeEditor.css",
      }) => <LinkRow href={href} label={label} name={name} />,
    },
    {
      content: ({
        href = "/roadmap/themeEditor.js",
        label = "JS File:",
        name = "themeEditor.js",
      }) => <LinkRow href={href} label={label} name={name} />,
    },
  ];

  return (
    <>
      <Text as="p">Here is the default setup for the Root Account theme editor.</Text>
      <Text as="p">
        If you know the customer's primary brand color, you can enter it below, and the other colors
        will automatically update.
      </Text>
      {themeEditorItems.map((item, idx) => (
        <View
          key={`theme-editor-item-${idx}`}
          as="div"
          borderWidth="0 0 small 0"
          borderColor="primary"
          padding="small 0"
        >
          <Flex direction="row" alignItems="center" gap="x-small">
            {item.content({ isDark })}
          </Flex>
        </View>
      ))}
    </>
  );
};

const summaryHeading = <Heading level="h2">Setup</Heading>;
const ThemeEditor = ({ isDark }: { isDark: boolean }) => (
  <ToggleGroup
    toggleLabel="Toggle Setup Instructions"
    summary={summaryHeading}
    iconExpanded={IconXSolid}
    icon={IconPlusSolid}
    border={false}
  >
    <View as="div" padding="0 medium">
      <ThemeEditorList isDark={isDark} />
    </View>
  </ToggleGroup>
);

export default ThemeEditor;
