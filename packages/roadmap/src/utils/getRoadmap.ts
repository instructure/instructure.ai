import paramsToPendo from "./paramsToPendo";

let roadmapListenerAdded = false;

type RoadmapRequestEvent = MessageEvent<{ value?: string }>;

const getRoadmap = (): Promise<RoadmapFeatures | null> => {
	window.parent.postMessage({ type: "getRoadmap" }, "*");

	return new Promise((resolve) => {
		if (roadmapListenerAdded) {
			// Listener already added, do not add again
			resolve(null);
			return;
		}
		roadmapListenerAdded = true;
		const handler = (event: RoadmapRequestEvent) => {
			if (event.data?.value) {
				window.removeEventListener("message", handler);
				roadmapListenerAdded = false;
				resolve(paramsToPendo(event.data.value));
			}
		};
		window.addEventListener("message", handler);
	});
};

export default getRoadmap;
