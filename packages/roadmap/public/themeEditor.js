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
				event.data &&
				event.data.source === "roadmap" &&
				event.data.type === "setHeight"
			) {

				try {
					iFrame.height = event.data.height;
					console.info("Set iframe height to", event.data.height);
				} catch (err) {
					console.error("Failed to set iframe height:", err);
				}
			}
		});

		window.addEventListener("DOMContentLoaded", (event) => {
			const roadmap = iFrame.getAttribute("data-roadmap")

			if(!roadmap) {
				console.error("data-roadmap attribute not found");
				return;
			}

			window.postMessage({value: roadmap}, "*")


		})
		
	})();
