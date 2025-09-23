import type { FC } from "react";
import { InstUISettingsProvider } from "@instructure/ui";
import { paramsToPendo } from "./utils";
import { useEffect } from "react";

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
      {roadmap && <pre>{JSON.stringify(roadmap, null, 2)}</pre>}
    </InstUISettingsProvider>
  );
};
export default App;
