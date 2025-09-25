const isPendoAPIFeature = (obj: unknown): obj is PendoAPIFeature => {
	return (
		obj &&
		typeof obj === "object" &&
		obj.feature &&
		typeof obj.feature === "object" &&
		"stage" in obj.feature &&
		"title" in obj.feature &&
		obj.product &&
		typeof obj.product === "object" &&
		"name" in obj.product &&
		"area" in obj.product
	);
};

const isPendoAPI = (obj: unknown): obj is PendoAPI => {
	return (
		obj &&
		typeof obj === "object" &&
		Array.isArray(obj.results) &&
		obj.results.every(isPendoAPIFeature)
	);
};

const paramsToPendo = (params: string | null): RoadmapFeatures | null => {
	if (!params) return null;

	let p: unknown;
	try {
		p = JSON.parse(decodeURIComponent(params));
	} catch {
		return null;
	}

	if (!isPendoAPI(p)) {
		return null;
	}

	const stages = Array.from(
		new Set(p.results.map((result) => result.feature.stage)),
	).filter(Boolean) as string[];
	const products = Array.from(
		new Set(p.results.map((result) => result.product.name)),
	).filter(Boolean) as string[];
	const productAreas = Array.from(
		new Set(p.results.map((result) => result.product.area)),
	).filter(Boolean) as string[];
	const labels = Array.from(
		new Set(p.results.flatMap((result) => result.feature.labels)),
	).filter(Boolean) as string[];
	const features = p.results;

	const roadmap: RoadmapFeatures = {
		features,
		labels,
		productAreas,
		products,
		stages,
	};

	if (
		Array.isArray(roadmap.stages) &&
		Array.isArray(roadmap.products) &&
		Array.isArray(roadmap.productAreas) &&
		Array.isArray(roadmap.labels) &&
		Array.isArray(roadmap.features)
	) {
		return roadmap;
	}

	return null;
};

export default paramsToPendo;
