import { IconMsExcelLine, type SVGIconProps } from "@instructure/ui";
import type { ProductNutritionFacts } from "../../types.ts";
import { ControlButton } from "./ControlButton.tsx";

const productToTable = (
	product: ProductNutritionFacts,
	id?: string,
): string => {
	const { data } = product;
	const safeID = id ? id : product.name.replace(/[^a-zA-Z0-9]/g, "");
	const revision = new Date().toLocaleDateString("en-US");
	const text = [
		// Feature
		safeID, // uid
		revision, // revision date
		product.name,
		product.description,
		// Model & Data
		data[0].segmentData[0].value, //base model
		data[0].segmentData[0].valueDescription, //base model description
		data[0].segmentData[1].value, // trained with user data
		data[0].segmentData[2].value, // data shared with model
		data[0].segmentData[2].valueDescription, // data shared with model description
		// Privacy & Compliance
		data[1].segmentData[0].valueDescription, // data retention
		data[1].segmentData[1].value, // Data Logging
		data[1].segmentData[1].valueDescription, // Data Logging description
		data[1].segmentData[2].value, // Regions
		data[1].segmentData[2].valueDescription, // Regions description
		data[1].segmentData[3].value, // PII
		data[1].segmentData[3].valueDescription, // PII description
		// Outputs
		data[2].segmentData[0].value, // settings control
		data[2].segmentData[1].value, // human in the loop
		data[2].segmentData[1].valueDescription, // human in the loop description
		data[2].segmentData[2].valueDescription, // guardrails description
		data[2].segmentData[3].valueDescription, // expected risks description
		data[2].segmentData[4].valueDescription, // intended outcomes description
	].join("\n");
	return text;
};

const Table = async (product: ProductNutritionFacts, id?: string) => {
	setTimeout(async () => {
		const tabularText = productToTable(product, id);
		try {
			await navigator.clipboard.writeText(tabularText);
		} catch (error) {
			let msg: string = "Failed to copy data to clipboard";
			if (error instanceof Error) {
				msg = error.message;
			} else if (typeof error === "string") {
				msg = error;
			}
			console.error(msg);
		}
	}, 0);
};

const TableControl: React.FC<{
	product: ProductNutritionFacts;
	id?: string;
}> = ({ product, id }) => (
	<ControlButton
		Icon={IconMsExcelLine as React.ElementType<SVGIconProps>}
		label="Copy table values"
		onClick={() => Table(product, id)}
	/>
);

export { TableControl };
