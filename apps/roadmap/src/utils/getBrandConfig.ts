type PageSettings = {
	locale: string;
	time_zone: string;
	use_high_contrast: boolean;
	active_brand_config_json_url: string;
	window_width: number;
};

type BrandConfig = Record<string, unknown>;

type PageSettingsEvent = MessageEvent<{ pageSettings?: PageSettings }>;

let cachedBrandConfig: BrandConfig | null = null;
let brandConfigPromise: Promise<BrandConfig> | null = null;

const getBrandConfig = (): Promise<BrandConfig> => {
	if (cachedBrandConfig !== null) {
		return Promise.resolve(cachedBrandConfig);
	}
	if (brandConfigPromise) {
		return brandConfigPromise;
	}
	window.parent.postMessage({ subject: "lti.getPageSettings" }, "*");

	brandConfigPromise = new Promise((resolve) => {
		const handler = async (event: PageSettingsEvent) => {
			// Only process lti.postMessage events
			if (
				event.data &&
				"subject" in event.data &&
				event.data.subject === "lti.postMessage" &&
				event.data.pageSettings
			) {
				const url = event.data.pageSettings.active_brand_config_json_url;
				let brandConfig: BrandConfig = {};
				try {
					const response = await fetch(url);
					brandConfig = await response.json();
				} catch (error) {
					console.error("Failed to fetch or parse brand config:", error);
				}
				window.removeEventListener("message", handler);
				const result = event.data.pageSettings.use_high_contrast
					? {}
					: (brandConfig ?? {});
				cachedBrandConfig = result;
				resolve(result);
			}
		};
		window.addEventListener("message", handler);
	});
	brandConfigPromise.finally(() => {
		brandConfigPromise = null;
	});
	return brandConfigPromise;
};

export default getBrandConfig;
