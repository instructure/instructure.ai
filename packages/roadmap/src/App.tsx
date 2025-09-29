import { canvas, Flex, InstUISettingsProvider } from "@instructure/ui";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Card, CardOverlay } from "./components";
import { getBrandConfig, getLogo, getRoadmap, sendHeight } from "./utils";
import "./App.css";

const App: FC = () => {
	const [overlayOpen, setOverlayOpen] = useState(false);
	const [selectedEntry, setSelectedEntry] = useState<PendoAPIFeature | null>(
		null,
	);
	const [brandConfig, setBrandConfig] = useState<unknown>({});
	const [roadmap, setRoadmap] = useState<RoadmapFeatures | null>(null);

	useEffect(() => {
		getRoadmap().then((data) => {
			setRoadmap(data);
		});
	}, []);

	useEffect(() => {
		getBrandConfig().then((config) => {
			setBrandConfig(config);
		});
	}, []);
	
	useEffect(() => {
		if (!roadmap) return;

		sendHeight();
		const handleResize = () => sendHeight();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [roadmap]);

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
