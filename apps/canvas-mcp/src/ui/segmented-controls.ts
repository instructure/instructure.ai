import { initSegmentedControl } from "@pantoken/interactions";

export function bindSegmentedControls(root: HTMLElement): () => void {
	const handles = [...root.querySelectorAll<HTMLElement>(".instui-segmented-control")].map(
		(host) => {
			const viewport = host.querySelector<HTMLElement>(":scope > .viewport");
			if (viewport) {
				for (const direction of ["start", "end"] as const) {
					const button = document.createElement("button");
					button.type = "button";
					button.className = `overflow-${direction} instui-button -color-tertiary -shape-square -size-sm -icon-chevron-${direction === "start" ? "left" : "right"}`;
					button.setAttribute(
						"aria-label",
						`Scroll ${direction === "start" ? "backward" : "forward"}`,
					);
					button.hidden = true;
					viewport.append(button);
				}
			}
			const handle = initSegmentedControl(host);
			host.querySelector("input:checked")?.closest("label")?.scrollIntoView?.({
				block: "nearest",
				inline: "nearest",
			});
			return handle;
		},
	);
	return () => handles.forEach((handle) => handle.cleanup());
}
