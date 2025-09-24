import type { FC } from "react";
import { InstUISettingsProvider, Flex } from "@instructure/ui";
import { paramsToPendo } from "./utils";
import { useEffect } from "react";
import { Card } from "./components";

const App: FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const roadmap: RoadmapFeatures | null = paramsToPendo(queryParams.get("q"));

  useEffect(() => {
    if (!roadmap) {
      //window.location.href = "https://roadmap.instructure.com";
      console.log("Redirecting to https://roadmap.instructure.com");
    }
  }, [roadmap]);

  return (
    <InstUISettingsProvider>
      {roadmap && (
        <Flex wrap="wrap" gap="paddingCardMedium" justifyItems="space-around" withVisualDebug>
          {roadmap.features.map((entry) => <Card key={entry.feature.title} entry={entry} />)}
        </Flex>
      )}
    </InstUISettingsProvider>
  );
};
export default App;
