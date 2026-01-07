import paramsToPendo from "./paramsToPendo";

let roadmapPromise: Promise<RoadmapFeatures | null> | undefined;
let cachedRoadmap: RoadmapFeatures | null | undefined;

type RoadmapRequestEvent = MessageEvent<{ value?: string }>;

const getRoadmap = (): Promise<RoadmapFeatures | null> => {
  console.debug("getRoadmap called");
  if (cachedRoadmap !== undefined && cachedRoadmap !== null) {
    console.debug("Returning cached roadmap");
    return Promise.resolve(cachedRoadmap);
  }
  if (roadmapPromise !== undefined) {
    console.debug("Returning existing roadmap promise");
    return roadmapPromise;
  }
  window.parent.postMessage({ type: "getRoadmap" }, "*");
  roadmapPromise = new Promise((resolve) => {
    console.debug("Listening for roadmap response");
    const handler = (event: RoadmapRequestEvent) => {
      console.debug("Received message event:", event);
      if (event.data && "value" in event.data && event.data.value !== undefined) {
        window.removeEventListener("message", handler);
        const result = paramsToPendo(event.data.value);
        cachedRoadmap = result;
        roadmapPromise = undefined;
        resolve(result);
      }
    };
    window.addEventListener("message", handler);
  });
  return roadmapPromise;
};

export default getRoadmap;
