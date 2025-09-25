type PageSettings = {
	locale: string;
	time_zone: string;
	use_high_contrast: boolean;
	active_brand_config_json_url: string;
	window_width: number;
};

type BrandConfig = Record<string, unknown>;

type PageSettingsEvent = MessageEvent<{ pageSettings?: PageSettings }>;

const getBrandConfig = (): Promise<BrandConfig> => {
	window.parent.postMessage({ subject: "lti.getPageSettings" }, "*");

	return new Promise((resolve) => {
		const handler = async (event: PageSettingsEvent) => {
			if (event.data?.pageSettings) {
				const url = event.data.pageSettings.active_brand_config_json_url;
				let brandConfig: BrandConfig = {};
				try {
					const response = await fetch(url);
					brandConfig = await response.json();
				} catch (error) {
					// Optionally log the error for debugging
					console.error("Failed to fetch or parse brand config:", error);
				}
				window.removeEventListener("message", handler);
				resolve(
					event.data.pageSettings.use_high_contrast ? {} : (brandConfig ?? {}),
				);
			}
		};
		window.addEventListener("message", handler);
	});
};

export default getBrandConfig;
