import { Flex, InstUISettingsProvider, canvas } from "@instructure/ui";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Card, CardOverlay } from "./components";
import { paramsToPendo, getBrandConfig } from "./utils";
import "./App.css"

const App: FC = () => {
	const [overlayOpen, setOverlayOpen] = useState(false);
	const [selectedEntry, setSelectedEntry] = useState<PendoAPIFeature | null>(
		null,
	);
	const [brandConfig, setBrandConfig] = useState<unknown>({});
	const queryParams = new URLSearchParams(window.location.search);
	const roadmap: RoadmapFeatures | null = paramsToPendo(queryParams.get("q"));

	useEffect(() => {
		getBrandConfig().then((config) => {
			setBrandConfig(config);
		});
	}, []);



	useEffect(() => {
		if (!roadmap) {
			//window.location.href = "https://roadmap.instructure.com";
			console.log("Redirecting to https://roadmap.instructure.com");
		}
	}, [roadmap]);

	useEffect(() => {
		const sendHeight = () => {
			window.parent.postMessage(
				{ height: document.body.scrollHeight, type: "setHeight", source: "roadmap" },
				"*",
			);
		};

		sendHeight();

		window.addEventListener("resize", sendHeight);
		window.addEventListener("load", sendHeight);

		return () => {
			window.removeEventListener("resize", sendHeight);
			window.removeEventListener("load", sendHeight);
		};
	}, []);

	return (
		<InstUISettingsProvider theme={{...canvas, ...(brandConfig as object)}}>
			{roadmap && (<>
				<Flex gap="paddingCardMedium" justifyItems="start" wrap="wrap">
					{roadmap.features.map((entry) => (
						<Card
							entry={entry}
							key={entry.feature.title}
							setOverlayOpen={setOverlayOpen}
							setSelectedEntry={setSelectedEntry}
						/>
					))}
				</Flex>
				{selectedEntry && (
					<CardOverlay
						entry={selectedEntry}
						isOpen={overlayOpen}
						setOpen={setOverlayOpen}
					/>
				)}
			</>)}
		</InstUISettingsProvider>
	);
};
export default App;
