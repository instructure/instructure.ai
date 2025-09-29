// ==== BEGIN Roadmap.js ====

/**
 * Canvas Theme Editor: Roadmap.js
 *
 * This script listens for messages from the roadmap iframe and handles
 * communication for roadmap data and dynamic resizing.
 *
 * Features:
 * - Listens for "getRoadmap" messages to return roadmap data from the iframe.
 * - Listens for "setHeight" messages to update the iframe's height dynamically.
 * - Uses a MutationObserver to attach listeners when the roadmap iframe is added to the DOM.
 * - Ensures only one message event listener is attached at a time for the roadmap iframe.
 * - Removes the event listener after handling a message to prevent multiple listeners and memory leaks.
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
		const handler = (event) => {
			if (!event.data) return;
			switch (event.data.type) {
				case "getRoadmap": {
					const roadmap = iFrame.getAttribute("data-roadmap");
					event.source.postMessage({ value: roadmap }, event.origin);
					window.removeEventListener("message", handler);
					roadmapListenerAdded = false;
					break;
				}
				case "setHeight":
					try {
						iFrame.height = event.data.height;
						console.info("Set iframe height to", event.data.height);
					} catch (err) {
						console.error("Failed to set iframe height:", err);
					}
					window.removeEventListener("message", handler);
					roadmapListenerAdded = false;
					break;
				default:
					break;
			}
		};
		window.addEventListener("message", handler);
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
