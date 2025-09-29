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
		console.debug("Fetching roadmap...");
		getRoadmap().then((data) => {
			console.debug("Roadmap fetched:", data);
			setRoadmap((prev) => {
				// Only update if data is different
				if (JSON.stringify(prev) !== JSON.stringify(data)) {
					return data;
				}
				return prev;
			});
		});
	}, []);

	useEffect(() => {
		console.debug("Fetching brand config...");
		getBrandConfig().then((config) => {
			console.debug("Brand config fetched.");
			setBrandConfig(config);
		});
	}, []);

	useEffect(() => {
		if (roadmap) {
			console.debug("Roadmap loaded, sending initial height.");
			sendHeight();
		}
	}, [roadmap]);

	useEffect(() => {
		const handleResize = () => {
			console.debug("Window resized, sending height...");
			sendHeight();
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<InstUISettingsProvider theme={{ ...canvas, ...(brandConfig as object) }}>
			{roadmap && (
				<>
					<Flex gap="paddingCardMedium" justifyItems="start" wrap="wrap">
						{roadmap.features.map((entry) => {
							const logo = getLogo(entry.product.name);
							return (
								<Card
									entry={{ ...entry, product: { ...entry.product, logo } }}
									key={entry.feature.id}
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
