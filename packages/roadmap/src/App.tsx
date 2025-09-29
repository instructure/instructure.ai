import { canvas, Flex, InstUISettingsProvider } from "@instructure/ui";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Card, CardOverlay } from "./components";
import { getBrandConfig, getLogo, paramsToPendo } from "./utils";
import "./App.css";

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
			// window.location.href = "https://roadmap.instructure.com";
			console.log("No roadmap data found");
		}
	}, [roadmap]);

	useEffect(() => {
		const sendHeight = () => {
			const frameHeight =
				document.body.scrollHeight < 800 ? 800 : document.body.scrollHeight;
			window.parent.postMessage(
				{
					height: frameHeight,
					source: "roadmap",
					type: "setHeight",
				},
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
		<InstUISettingsProvider theme={{ ...canvas, ...(brandConfig as object) }}>
			{roadmap && (
				<>
					<Flex gap="paddingCardMedium" justifyItems="start" wrap="wrap">
						{roadmap.features.map((entry) => {
							entry.product.logo = getLogo(entry.product.name);
							return (
								<Card
									entry={entry}
									key={entry.feature.title}
									setOverlayOpen={setOverlayOpen}
									setSelectedEntry={setSelectedEntry}
								/>
							);
						})}
					</Flex>
					{selectedEntry && (
						<CardOverlay
							entry={selectedEntry}
							isOpen={overlayOpen}
							setOpen={setOverlayOpen}
						/>
					)}
				</>
			)}
		</InstUISettingsProvider>
	);
};
export default App;
