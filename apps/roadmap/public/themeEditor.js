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
		if (iframeListenerMap.has(iFrame)) {return;}

		const handler = (event) => {
			if (!event.data) {return;}
			// Only respond to getRoadmap and lti.getPageSettings events
			if (event.data.type === "getRoadmap") {
				const roadmap = iFrame.getAttribute("data-roadmap");
				console.log("[themeEditor.js] Roadmap attribute:", roadmap);
				if (iFrame.contentWindow) {
					iFrame.contentWindow.postMessage({ value: roadmap }, "*");
					console.log("[themeEditor.js] Sent roadmap message", {
						value: roadmap,
					});
				} else {
					console.error("No contentWindow for roadmap iframe");
				}
			} else if (event.data.subject === "lti.getPageSettings") {
				// Echo lti.getPageSettings as lti.postMessage for brand config
				if (iFrame.contentWindow) {
					iFrame.contentWindow.postMessage(
						{
							pageSettings: event.data.pageSettings,
							subject: "lti.postMessage",
						},
						"*",
					);
					console.log(
						"[themeEditor.js] Sent lti.postMessage",
						event.data.pageSettings,
					);
				}
			} else if (event.data.type === "setHeight") {
				try {
					iFrame.height = event.data.height;
				} catch (error) {
					console.error("Failed to set iframe height:", error);
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
				const removeElementsWithRetry = (attempt = 0) => {
					const maxAttempts = 10;
					const delay = 100;
					let allRemoved = true;
					const selectors = [
						"#right-side-wrapper",
						"#left-side",
						"#courseMenuToggle",
					];
					selectors.forEach((sel) => {
						const el = document.querySelector(sel);
						if (el) {
							el.remove();
						} else {
							allRemoved = false;
						}
					});
					const main = document.querySelector("#main");
					if (main?.style) {
						main.style.setProperty("margin", "0");
					}
					if (!allRemoved && attempt < maxAttempts) {
						setTimeout(() => removeElementsWithRetry(attempt + 1), delay);
					}
				};
				removeElementsWithRetry();
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

// ==== BEGIN MoveAvatar.js ====

/**
 * Canvas Theme Editor: MoveAvatar.js
 *
 * Rearranges the global nav structore to put the user avatar at the bottom
 *
 * @version 2025.11.06.00
 *
 */

(() => {
	let avatarObserver;
	let lastPath;

	const moveAvatar = () => {
		const firstLi = document.querySelector("#menu li:first-child");
		const targetList = document.querySelector(
			".ic-app-header__secondary-navigation > .ic-app-header__menu-list",
		);

		// Only move when the target list exists AND currently has exactly one child
		if (firstLi && targetList && targetList.childElementCount === 1) {
			targetList.appendChild(firstLi);
			if (avatarObserver) {avatarObserver.disconnect();} // stop for this page
			avatarObserver = undefined;
		}
	};

	const startObserverForThisPage = () => {
		// Ensure fresh observer per page view
		if (avatarObserver) {avatarObserver.disconnect();}
		avatarObserver = new MutationObserver(moveAvatar);
		avatarObserver.observe(document.body, { childList: true, subtree: true });

		// Immediate attempt (in case DOM is already ready)
		moveAvatar();
	};

	const onLocationChange = () => {
		const path = location.pathname + location.search + location.hash;
		if (path !== lastPath) {
			lastPath = path;
			startObserverForThisPage();
		}
	};

	const _pushState = history.pushState;
	history.pushState = function  pushState(...args) {
		const ret = _pushState.apply(this, args);
		window.dispatchEvent(new Event("locationchange"));
		return ret;
	};

	const _replaceState = history.replaceState;
	history.replaceState = function  replaceState(...args) {
		const ret = _replaceState.apply(this, args);
		window.dispatchEvent(new Event("locationchange"));
		return ret;
	};

	window.addEventListener("popstate", () =>
		window.dispatchEvent(new Event("locationchange")),
	);
	window.addEventListener("locationchange", onLocationChange);

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", onLocationChange, {
			once: true,
		});
	} else {
		onLocationChange();
	}
})();

// ==== END MoveAvatar.js ====
