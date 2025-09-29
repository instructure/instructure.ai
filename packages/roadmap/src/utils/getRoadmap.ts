import paramsToPendo from "./paramsToPendo";

type RoadmapRequestEvent = MessageEvent<{ value?: string }>;

const getRoadmap = (): Promise<RoadmapFeatures | null> => {
    window.parent.postMessage({ type: "getRoadmap" }, "*");

    return new Promise((resolve) => {
        const handler = (event: RoadmapRequestEvent) => {
            if (event.data?.value) {
                window.removeEventListener("message", handler);
                resolve(paramsToPendo(event.data.value));
            }
        };
        window.addEventListener("message", handler);
    });
};

export default getRoadmap;
