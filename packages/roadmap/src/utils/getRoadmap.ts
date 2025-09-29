import paramsToPendo from "./paramsToPendo";

let roadmapPromise: Promise<RoadmapFeatures | null> | null = null;

type RoadmapRequestEvent = MessageEvent<{ value?: string }>;

const getRoadmap = (): Promise<RoadmapFeatures | null> => {
	if (roadmapPromise) {
		return roadmapPromise;
	}
	window.parent.postMessage({ type: "getRoadmap" }, "*");

	roadmapPromise = new Promise((resolve) => {
		const handler = (event: RoadmapRequestEvent) => {
			if (event.data?.value) {
				window.removeEventListener("message", handler);

				roadmapPromise = null;
				resolve(paramsToPendo(event.data.value));
			}
		};
		window.addEventListener("message", handler);
	});
	return roadmapPromise;
};

export default getRoadmap;
