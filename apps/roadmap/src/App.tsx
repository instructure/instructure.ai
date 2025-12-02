import { Flex, InstUISettingsProvider, canvas } from "@instructure/ui";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardOverlay, Loading } from "./components";
import {
  getBrandConfig,
  getColor,
  getLogo,
  getRoadmap,
  sendHeight,
} from "./utils";
import "./App.css";

const App: FC = () => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PendoAPIFeature | null>(
    null,
  );
  const [brandConfig, setBrandConfig] = useState<unknown>({});
  const [roadmap, setRoadmap] = useState<RoadmapFeatures | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    getRoadmap().then((data) => {
      setRoadmap(data);
    });
  }, []);

  useEffect(() => {
    getBrandConfig().then((config) => {
      setBrandConfig(config);
    });
  }, []);

  useEffect(() => {
    if (roadmap) {
      sendHeight();
    }
  }, [roadmap]);

  useEffect(() => {
    const handleResize = () => {
      sendHeight();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const Entries = useMemo(() => {
    if (!roadmap) {
      return [];
    }
    return roadmap.features.map((entry) => ({
      ...entry,
      product: {
        ...entry.product,
        color: getColor(entry.product.name),
        logo: getLogo(entry.product.name),
      },
    }));
  }, [roadmap]);

  useEffect(() => {
    if (!roadmap) {
      setShowLoading(false); 
      const timeout = setTimeout(() => setShowLoading(true), 1000);
      return () => clearTimeout(timeout);
    }
  }, [roadmap]);

  return (
    <InstUISettingsProvider
      theme={{
        ...canvas,
        ...(brandConfig as object),
        typography: {
          ...canvas.typography,
          fontFamily: "Atkinson Hyperlegible Next, sans-serif",
        },
      }}
    >
      {Entries.length ? (
        <>
          <Flex
            gap="paddingCardMedium"
            justifyItems="start"
            width="77.125rem"
            wrap="wrap"
          >
            {Entries.map((entry) => (
              <Card
                entry={entry}
                isDark={isDark}
                key={entry.feature.title}
                setOverlayOpen={setOverlayOpen}
                setSelectedEntry={setSelectedEntry}
              />
            ))}
          </Flex>
          {selectedEntry && (
            <CardOverlay
              entry={selectedEntry}
              isDark={isDark}
              isOpen={overlayOpen}
              setOpen={setOverlayOpen}
            />
          )}
        </>
      ) : showLoading ? (
        <Loading isDark={isDark} />
      ) : null}
    </InstUISettingsProvider>
  );
};
export default App;
