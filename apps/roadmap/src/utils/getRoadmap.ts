import paramsToPendo from "./paramsToPendo";

let roadmapPromise: Promise<RoadmapFeatures | null> | null = null;
let cachedRoadmap: RoadmapFeatures | null = null;

type RoadmapRequestEvent = MessageEvent<{ value?: string }>;

const getRoadmap = (): Promise<RoadmapFeatures | null> => {
	if (cachedRoadmap !== null) {
		return Promise.resolve(cachedRoadmap);
	}
	if (roadmapPromise) {
		return roadmapPromise;
	}
	window.parent.postMessage({ type: "getRoadmap" }, "*");
	roadmapPromise = new Promise((resolve) => {
		const handler = (event: RoadmapRequestEvent) => {
			if (event.data?.value) {
				window.removeEventListener("message", handler);
				const result = paramsToPendo(event.data.value);
				cachedRoadmap = result;
				roadmapPromise = null;
				resolve(result);
			} else {
				console.log("no roadmap data found in event", event);
				resolve(null);
			}
		};
		window.addEventListener("message", handler);
	});
	return roadmapPromise;
};

export default getRoadmap;
