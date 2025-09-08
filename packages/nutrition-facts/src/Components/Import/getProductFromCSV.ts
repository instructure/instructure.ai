import Papa from "papaparse";
import { csvUrl } from "../../assets/";
import type {
	PageLayout,
	ProductNutritionFacts,
	Products,
} from "../../types.ts";

// Helper function to fetch and parse products from CSV
const fetchProductsFromCSV = async (): Promise<Products> => {
	const response = await fetch(csvUrl);
	const data = await response.text();
	const products: Products = {};

	const parsed = Papa.parse<string[]>(data, {
		delimiter: ",",
		skipEmptyLines: true,
	});

	for (const values of parsed.data) {
		const uid = values[0]?.toLowerCase();
		if (!uid) continue;
		const updatedProduct: ProductNutritionFacts = {
			data: [
				{
					blockTitle: "Model & Data",
					segmentData: [
						{
							description:
								"The foundational AI on which further training and customizations are built.",
							descriptionHint: "Describe the base model",
							segmentTitle: "Base Model",
							value: values[4],
							valueDescription: values[5],
							valueHint: "Input base model",
						},
						{
							description:
								"Indicates the AI model has been given customer data in order to improve its results.",
							inputOptions: ["Yes", "No"],
							inputType: "select",
							segmentTitle: "Trained with User Data",
							value: values[6],
							valueHint: "Yes / No",
						},
						{
							description:
								"Indicates which training or operational content was given to the model.",
							descriptionHint: "Describe the data shared",
							inputOptions: ["None", "Course", "Faculty", "Student", "Other"],
							inputType: "multi-select",
							segmentTitle: "Data Shared with Model",
							value: values[7],
							valueDescription: values[8],
							valueHint: "Select shared data set",
						},
					],
				},
				{
					blockTitle: "Privacy & Compliance",
					segmentData: [
						{
							description: "How long the model stores customer data.",
							descriptionHint: "Describe the data retention period",
							segmentTitle: "Data Retention",
							valueDescription: values[9],
						},
						{
							description:
								"Recording the AI's performance for auditing, analysis, and improvement.",
							descriptionHint: "Describe the data logging practices",
							inputOptions: ["Logs data", "Does not log data"],
							inputType: "select",
							segmentTitle: "Data Logging",
							value: values[10],
							valueDescription: values[11],
							valueHint: "Logs data / Does not log data",
						},
						{
							description:
								"The locations where the AI model is officially available and supported.",
							descriptionHint: "Describe the supported regions",
							inputOptions: [
								"Global",
								"Virginia",
								"Oregon",
								"Montreal",
								"Dublin",
								"Frankfurt",
								"Singapore",
								"Sydney",
								"Other",
							],
							inputType: "multi-select",
							segmentTitle: "Regions Supported",
							value: values[12],
							valueDescription: values[13],
							valueHint: "Select region(s)",
						},
						{
							description:
								"Sensitive data that can be used to identify an individual.",
							descriptionHint: "Describe the handling of PII",
							inputOptions: ["Exposed", "Not Exposed"],
							inputType: "select",
							segmentTitle: "PII",
							value: values[14],
							valueDescription: values[15],
							valueHint: "Exposed / Not Exposed",
						},
					],
				},
				{
					blockTitle: "Outputs",
					segmentData: [
						{
							description:
								"The ability to turn the AI on or off within the product.",
							inputOptions: ["Yes", "No"],
							inputType: "select",
							segmentTitle: "AI Settings Control",
							value: values[16],
							valueHint: "Yes / No",
						},
						{
							description:
								"Indicates if a human is involved in the AI's process or output.",
							descriptionHint: "Describe the human involvement",
							inputOptions: ["Yes", "No"],
							inputType: "select",
							segmentTitle: "Human in the Loop",
							value: values[17],
							valueDescription: values[18],
							valueHint: "Yes / No",
						},
						{
							description:
								"Preventative safety mechanisms or limitations built into the AI model.",
							descriptionHint: "Describe the guardrails",
							segmentTitle: "Guardrails",
							valueDescription: values[19],
						},
						{
							description: "Any risks the model may pose to the user.",
							descriptionHint: "Describe the expected risks",
							segmentTitle: "Expected Risks",
							valueDescription: values[20],
						},
						{
							description:
								"The specific results the AI model is meant to achieve.",
							descriptionHint: "Describe the intended outcomes",
							segmentTitle: "Intended Outcomes",
							valueDescription: values[21],
						},
					],
				},
			],
			description: values[3],
			descriptionHint: "Describe your feature",
			id: values[0],
			name: values[2],
			nameHint: "Feature Name",
			revision: values[1],
		};
		products[uid] = updatedProduct;
	}

	return products;
};

// Returns all products from CSV
const getProductsFromCSV = async (): Promise<Products> => {
	return await fetchProductsFromCSV();
};

// Returns a single product as before
const getProductFromCSV = async (
	Product: ProductNutritionFacts,
	Layout: PageLayout,
	preset: string,
): Promise<
	{ layout: PageLayout; product: ProductNutritionFacts } | undefined
> => {
	const products = await fetchProductsFromCSV();
	const id = preset.toLowerCase();

	if (products[id]) {
		return { layout: Layout, product: products[id] };
	}

	return { layout: Layout, product: Product };
};

export { getProductFromCSV, getProductsFromCSV };
