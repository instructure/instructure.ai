import type {
	ProductNutritionFacts,
	FeatureMeta,
	SegmentBase,
	ModelAndDataSegment,
	PrivacyComplianceSegment,
	OutputsSegment,
	ProductsMeta, 
AiPermissions, 
StrictAiPermissions, 
StrictNutritionFacts, 
} from "../../types.ts";
import { cacheJson, Permissions } from "../../assets";
import { ControlButton } from "./";
import { IconCodeLine, type SVGIconProps } from "@instructure/ui";

const Cache = cacheJson as ProductsMeta;

function stripSegment<
	T extends {
		valueHint?: SegmentBase["valueHint"];
		descriptionHint?: SegmentBase["descriptionHint"];
	},
>(seg: T): Omit<T, "valueHint" | "descriptionHint"> {
	const { valueHint, descriptionHint, ...s } = seg;
	return s;
}

const ExportJSON = (id: ProductNutritionFacts["id"]): FeatureMeta => {
	const cachedFeature = Cache.features[id.toLocaleLowerCase()];

	if (!cachedFeature) {
		return {
			sha256: "",
			lastUpdated: "",
			dataPermissionsLevel: [] as StrictAiPermissions[],
			nutritionFacts: {
				id: "<id> not found",
				name: "",
				data: [],
			} as ProductNutritionFacts
		} as FeatureMeta
	}

	const level: ProductNutritionFacts["permissions"] = (cachedFeature.nutritionFacts as ProductNutritionFacts).permissions

		level ? Permissions[level + 1].highlighted = true : undefined

	const strictPermissions: AiPermissions[] = Permissions.slice(1)

	const strictData = cachedFeature.nutritionFacts.data.map((block) => {
		switch (block.blockTitle) {
			case "Model & Data":
				return {
					blockTitle: block.blockTitle,
					segmentData: block.segmentData.map(stripSegment) as ModelAndDataSegment[],
				};
			case "Privacy & Compliance":
				return {
					blockTitle: block.blockTitle,
					segmentData: block.segmentData.map(stripSegment) as PrivacyComplianceSegment[],
				};
			case "Outputs":
				return {
					blockTitle: block.blockTitle,
					segmentData: block.segmentData.map(stripSegment) as OutputsSegment[],
				};
			default:
				return block;
		}
	});

	const strictReturn = {
		sha256: cachedFeature.sha256,
		lastUpdated: cachedFeature.lastUpdated,
		nutritionFacts: {
			...cachedFeature.nutritionFacts,
			data: strictData
		} as StrictNutritionFacts,
		dataPermissionsLevel: strictPermissions
	} as FeatureMeta

	return strictReturn
}

const CopyObject = async (id: string) => {
	try {
		const productObj: FeatureMeta = ExportJSON(id)
		await navigator.clipboard.writeText(JSON.stringify(productObj, null, 2));
	} catch (error) {
		let msg: string = "Failed to copy data to clipboard";
		if (error instanceof Error) {
			msg = error.message;
		} else if (typeof error === "string") {
			msg = error;
		}
		console.error(msg);
	}
};

const ObjectControl = ({
	product,
	background,
	border,
	color,
}: {
	product?: ProductNutritionFacts;
	background?: boolean;
	border?: boolean;
	color?: "primary" | "primary-inverse";
}) => {
	return (
		<ControlButton
			background={background}
			border={border}
			color={color}
			disabled={!product?.id}
			Icon={IconCodeLine as React.ElementType<SVGIconProps>}
			key="link"
			label="Copy JSON"
			onClick={() => {
				if (product?.id) {
					CopyObject(product.id);
				}
			}}
		/>
	);
};

export { ObjectControl };