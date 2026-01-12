interface PageSettings {
  locale: string;
  time_zone: string;
  use_high_contrast: boolean;
  active_brand_config_json_url: string;
  window_width: number;
}

type BrandConfig = Record<string, unknown> | undefined;

type PageSettingsEvent = MessageEvent<{ pageSettings?: PageSettings }>;

let cachedBrandConfig: BrandConfig | undefined = undefined;
let brandConfigPromise: Promise<BrandConfig> | undefined = undefined;

const fetchBrandConfig = async (url: string): Promise<BrandConfig> => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch or parse brand config:", error);
    return {};
  }
};

const getBrandConfig = (): Promise<BrandConfig> => {
  if (cachedBrandConfig) {
    return Promise.resolve(cachedBrandConfig);
  }
  if (brandConfigPromise) {
    return brandConfigPromise;
  }
  window.parent.postMessage({ subject: "lti.getPageSettings" }, "*");

  brandConfigPromise = new Promise((resolve) => {
    const handlePageSettingsEvent = async (event: PageSettingsEvent) => {
      if (
        event.data &&
        "subject" in event.data &&
        event.data.subject === "lti.postMessage" &&
        event.data.pageSettings
      ) {
        const url = event.data.pageSettings.active_brand_config_json_url;
        let brandConfig: BrandConfig = await fetchBrandConfig(url);

        window.removeEventListener("message", handlePageSettingsEvent);

        let result: BrandConfig = undefined;
        if (event.data.pageSettings.use_high_contrast) {
          result = undefined;
        } else {
          result = brandConfig ?? undefined;
        }
        cachedBrandConfig = result;
        resolve(result);
      }
    };

    window.addEventListener("message", handlePageSettingsEvent);
  });
  void brandConfigPromise.finally(() => {
    brandConfigPromise = undefined;
  });
  return brandConfigPromise;
};

// oxlint-disable-next-line no-named-export
export { fetchBrandConfig, getBrandConfig };
