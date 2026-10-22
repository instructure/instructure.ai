import "./app.css";
import { Card, CardOverlay, Loading } from "./components";
import { type FC, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Flex, InstUISettingsProvider, type Theme, canvas } from "@instructure/ui";
import {
  frameResize,
  getBrandConfig,
  getColor,
  getLogo,
  getRoadmap,
  hideNavigationMenu,
  hideRightSideWrapper,
} from "./utils";

type ThemeOrOverride = Theme | Record<string, unknown>;

const LOADING_DELAY_MS = 1000;

const createStore = <Value,>(initialValue: Value) => {
  const listeners = new Set<() => void>();
  let snapshot = initialValue;
  return {
    getSnapshot: () => snapshot,
    set: (value: Value) => {
      snapshot = value;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

const brandConfigStore = createStore<ThemeOrOverride | undefined>(undefined);
const roadmapStore = createStore<RoadmapFeatures | undefined>(undefined);

const useBrandConfig = () => {
  const brandConfig = useSyncExternalStore(
    brandConfigStore.subscribe,
    brandConfigStore.getSnapshot,
    brandConfigStore.getSnapshot,
  );
  useEffect(() => {
    void getBrandConfig().then((config) => {
      brandConfigStore.set(config);
    });
  }, []);
  return brandConfig;
};

const useRoadmap = () => {
  const roadmap = useSyncExternalStore(
    roadmapStore.subscribe,
    roadmapStore.getSnapshot,
    roadmapStore.getSnapshot,
  );
  useEffect(() => {
    void getRoadmap().then((data) => {
      roadmapStore.set(data ?? undefined);
    });
  }, []);
  return roadmap;
};

const useShowLoading = (roadmap: RoadmapFeatures | undefined) => {
  const [loadingStore] = useState(() => createStore(false));
  const showLoading = useSyncExternalStore(
    loadingStore.subscribe,
    loadingStore.getSnapshot,
    loadingStore.getSnapshot,
  );
  useEffect(() => {
    if (roadmap) return;
    const timeout = setTimeout(() => loadingStore.set(true), LOADING_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [loadingStore, roadmap]);
  return showLoading && !roadmap;
};

const useSendHeightOnChange = (roadmap: RoadmapFeatures | undefined) => {
  useEffect(() => {
    if (roadmap) {
      frameResize();
    }
  }, [roadmap]);
  useEffect(() => {
    const handleResize = () => {
      frameResize();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
};

const useEntries = (roadmap: RoadmapFeatures | undefined) =>
  useMemo(() => {
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

const useTheme = (brandConfig: ThemeOrOverride | undefined) =>
  useMemo(
    () => ({
      ...canvas,
      ...brandConfig,
      typography: {
        ...canvas.typography,
        fontFamily: "Atkinson Hyperlegible Next, sans-serif",
      },
    }),
    [brandConfig],
  );

const CardsList: FC<{
  entries: ReturnType<typeof useEntries>;
  isDark: boolean;
  setOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEntry: React.Dispatch<React.SetStateAction<PendoAPIFeature | undefined>>;
}> = ({ entries, isDark, setOverlayOpen, setSelectedEntry }) => (
  <Flex gap="paddingCardMedium" justifyItems="start" width="77.125rem" wrap="wrap">
    {entries.map((entry) => (
      <Card
        entry={entry}
        isDark={isDark}
        key={entry.feature.title}
        setOverlayOpen={setOverlayOpen}
        setSelectedEntry={setSelectedEntry}
      />
    ))}
  </Flex>
);

const ENTRIES_EMPTY_LENGTH = 0;

const useAppState = () => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PendoAPIFeature | undefined>(undefined);
  return { overlayOpen, selectedEntry, setOverlayOpen, setSelectedEntry };
};

const useAppData = () => {
  const brandConfig = useBrandConfig();
  const roadmap = useRoadmap();
  const showLoading = useShowLoading(roadmap);
  useSendHeightOnChange(roadmap);
  const Entries = useEntries(roadmap);
  const theme = useTheme(brandConfig);
  return { Entries, showLoading, theme };
};

const RenderContent: FC<{
  Entries: ReturnType<typeof useEntries>;
  showLoading: boolean;
  isDark: boolean;
  overlayOpen: boolean;
  setOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEntry: PendoAPIFeature | undefined;
  setSelectedEntry: React.Dispatch<React.SetStateAction<PendoAPIFeature | undefined>>;
}> = ({
  Entries,
  showLoading,
  isDark,
  overlayOpen,
  setOverlayOpen,
  selectedEntry,
  setSelectedEntry,
}) => {
  if (Entries.length > ENTRIES_EMPTY_LENGTH) {
    return (
      <>
        <CardsList
          entries={Entries}
          isDark={isDark}
          setOverlayOpen={setOverlayOpen}
          setSelectedEntry={setSelectedEntry}
        />
        {selectedEntry && (
          <CardOverlay
            entry={selectedEntry}
            isDark={isDark}
            isOpen={overlayOpen}
            setOpen={setOverlayOpen}
          />
        )}
      </>
    );
  } else if (showLoading) {
    return <Loading isDark={isDark} />;
  }
  return <></>;
};

const App: FC = () => {
  const isDark = false; // Placeholder for potential dark mode logic
  const { overlayOpen, setOverlayOpen, selectedEntry, setSelectedEntry } = useAppState();
  const { Entries, showLoading, theme } = useAppData();

  useEffect(() => {
    frameResize();
    hideNavigationMenu();
    hideRightSideWrapper();
  }, []);

  return (
    <InstUISettingsProvider theme={theme}>
      <RenderContent
        Entries={Entries}
        showLoading={showLoading}
        isDark={isDark}
        overlayOpen={overlayOpen}
        setOverlayOpen={setOverlayOpen}
        selectedEntry={selectedEntry}
        setSelectedEntry={setSelectedEntry}
      />
    </InstUISettingsProvider>
  );
};

export default App;
