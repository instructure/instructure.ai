// ==== BEGIN Roadmap.js ====

/**
 * Canvas Theme Editor: Roadmap.js
 *
 * This script listens for messages from the roadmap iframe and handles
 * communication for roadmap data and dynamic resizing.
 *
 * - Listens for "getRoadmap" messages to return roadmap data from the iframe.
 * - Listens for "setHeight" messages to update the iframe's height dynamically.
 * - Uses a MutationObserver to attach listeners when the roadmap iframe is added to the DOM.
 *
 * Only runs on the "/pages/instructure-roadmap" path.
 */

if (window.location.pathname.endsWith("/pages/instructure-roadmap")) {
	console.info("Roadmap script loaded");

	let roadmapListenerAdded = false;
	const attachListener = (iFrame) => {
		if (!(iFrame instanceof HTMLIFrameElement)) {
			console.error('Element with id "roadmap" is not an HTMLIFrameElement');
			return;
		}
		if (roadmapListenerAdded) return;

		roadmapListenerAdded = true;
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

	const existing = document.getElementById("roadmap");
	if (existing) {
		attachListener(existing);
		observer.disconnect();
	}
}

// ==== END Roadmap.js ====
