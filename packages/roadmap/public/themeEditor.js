/* Canvas Theme Editor: Dynamically resize roadmap iframe to fit content */
window.location.pathname.endsWith("/pages/instructure-roadmap") &&
	(() => {

		console.info("Roadmap script loaded");

				const iFrame = document.getElementById("roadmap");
				if (!iFrame) {
					console.error("Roadmap iframe not found");
					return;
				}
				if (!(iFrame instanceof HTMLIFrameElement)) {
					console.error(
						'Element with id "roadmap" is not an HTMLIFrameElement',
					);
					return;
				}

		window.addEventListener("message", (event) => {
			if (
				!event.data &&
				!event.data.source === "roadmap"
			) { return; }

			else if (event.data?.type === "getRoadmap") {
				const roadmap = iFrame.getAttribute("data-roadmap");
				window.postMessage({ value: roadmap }, "*");
				return;
			}

			if (event.data?.type === "setHeight") {
				try {
					iFrame.height = event.data.height;
					console.info("Set iframe height to", event.data.height);
				} catch (err) {
					console.error("Failed to set iframe height:", err);
				}
			}
		});
	})();
