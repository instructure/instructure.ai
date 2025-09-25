type PendoAPI = {
	results: PendoAPIFeature[];
};

type PendoAPIFeature = {
	feature: {
		description: string | null;
		labels: string[] | null;
		links:
			| {
					title: string;
					linkUrl: string;
			  }[]
			| null;
		stage: string | null;
		title: string;
	};
	product: {
		area: string | null;
		name: string;
	};
};

type RoadmapFeatures = {
	stages: string[];
	products: string[];
	productAreas: string[];
	labels: string[];
	features: PendoAPIFeature[];
};

declare module "*.css" {
	const classes: { [key: string]: string };
	export default classes;
}
