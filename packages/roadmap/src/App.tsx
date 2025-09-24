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

  useEffect(() => {
    const sendHeight = () => {
      window.parent.postMessage(
        { type: "setHeight", height: document.body.scrollHeight },
        "*"
      );
    };

    sendHeight();

    window.addEventListener("resize", sendHeight);

    window.addEventListener("load", sendHeight);

    return () => {
      window.removeEventListener("resize", sendHeight);
      window.removeEventListener("load", sendHeight);
    };
  }, []);

  return (
    <InstUISettingsProvider>
      {roadmap && (
        <Flex wrap="wrap" gap="paddingCardMedium" justifyItems="start">

          {roadmap.features.map((entry) => <Card key={entry.feature.title} entry={entry} />)}
        </Flex>
      )}
    </InstUISettingsProvider>
  );
};
export default App;
