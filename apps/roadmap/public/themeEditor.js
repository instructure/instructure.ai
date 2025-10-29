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
 *
 * Only runs on the "/pages/instructure-roadmap" path.
 * 
 * @version 2025.10.29.00
 * 
 */

const path = window.location.pathname;
const matchesRoadmap = path.endsWith("/pages/instructure-roadmap");
const matchesCourse = /^\/courses\/\d+$/.test(path);
const matchesCourseWiki = /^\/courses\/[1-9]\d*\/wiki$/.test(path);

if (matchesRoadmap || matchesCourse || matchesCourseWiki) {
	console.info("Roadmap script loaded");

	const iframeListenerMap = new WeakMap();
	const attachListener = (iFrame) => {
		if (!(iFrame instanceof HTMLIFrameElement)) {
			console.error('Element with id "roadmap" is not an HTMLIFrameElement');
			return;
		}
		if (iframeListenerMap.has(iFrame)) return;

					const handler = (event) => {
						if (!event.data) return;
						// Only respond to getRoadmap and lti.getPageSettings events
						if (event.data.type === "getRoadmap") {
							const roadmap = iFrame.getAttribute("data-roadmap");
							console.log("[themeEditor.js] Roadmap attribute:", roadmap);
							if (iFrame.contentWindow) {
								iFrame.contentWindow.postMessage({ value: roadmap }, "*");
								console.log("[themeEditor.js] Sent roadmap message", { value: roadmap });
							} else {
								console.error("No contentWindow for roadmap iframe");
							}
						} else if (event.data.subject === "lti.getPageSettings") {
							// Echo lti.getPageSettings as lti.postMessage for brand config
							if (iFrame.contentWindow) {
								iFrame.contentWindow.postMessage({ subject: "lti.postMessage", pageSettings: event.data.pageSettings }, "*");
								console.log("[themeEditor.js] Sent lti.postMessage", event.data.pageSettings);
							}
						} else if (event.data.type === "setHeight") {
							try {
								iFrame.height = event.data.height;
							} catch (err) {
								console.error("Failed to set iframe height:", err);
							}
						}
						// Ignore all other events
					};
		window.addEventListener("message", handler);
		iframeListenerMap.set(iFrame, handler);
	};

	const observer = new MutationObserver((_mutations, obs) => {
		const iFrame = document.getElementById("roadmap");
		if (iFrame) {
			attachListener(iFrame);
			if (matchesCourse) {
    			console.info("Setting Roadmap page to full screen");
    			document.querySelector("#right-side-wrapper")?.remove();
    			document.querySelector("#left-side")?.remove();
					document.querySelector("#courseMenuToggle")?.remove();
    			document.querySelector("#main")?.style?.setProperty("margin", "0");
  		}
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
