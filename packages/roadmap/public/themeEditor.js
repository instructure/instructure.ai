/* Canvas Theme Editor: Dynamically resize roadmap iframe to fit content */
if (window.location.pathname.endsWith("/pages/instructure-roadmap")) {
	console.info("Roadmap script loaded");

	const attachListener = (iFrame) => {
		if (!(iFrame instanceof HTMLIFrameElement)) {
			console.error('Element with id "roadmap" is not an HTMLIFrameElement');
			return;
		}
		window.addEventListener("message", (event) => {
			if (!event.data) return;
			switch (event.data.type) {
				case "getRoadmap": {
					const roadmap = iFrame.getAttribute("data-roadmap");
					event.source.postMessage({ value: roadmap }, event.origin);
					break;
				}
				case "setHeight":
					try {
						iFrame.height = event.data.height;
						console.info("Set iframe height to", event.data.height);
					} catch (err) {
						console.error("Failed to set iframe height:", err);
					}
					break;
				default:
					break;
			}
		});
	};

	const observer = new MutationObserver((_mutations, obs) => {
		const iFrame = document.getElementById("roadmap");
		if (iFrame) {
			attachListener(iFrame);
			obs.disconnect();
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });

	// In case the iframe is already present
	const existing = document.getElementById("roadmap");
	if (existing) {
		attachListener(existing);
		observer.disconnect();
	}
}
