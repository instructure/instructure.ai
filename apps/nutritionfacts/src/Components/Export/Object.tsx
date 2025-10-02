import { IconCodeLine, type SVGIconProps } from "@instructure/ui";
import { AiInformation, cacheJson, Permissions } from "../../assets";
import type {
	AiPermissions,
	FeatureMeta,
	ModelAndDataSegment,
	OutputsSegment,
	PrivacyComplianceSegment,
	ProductNutritionFacts,
	ProductsMeta,
	SegmentBase,
	StrictAiInformation,
	StrictAiPermissions,
	StrictNutritionFacts,
} from "../../types.ts";
import { ControlButton } from "./";

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
			dataPermissionLevels: [] as StrictAiPermissions[],
			lastUpdated: "",
			nutritionFacts: {
				data: [],
				id: "<id> not found",
				name: "",
				permissions: 0,
			} as ProductNutritionFacts,
			sha256: "",
		} as FeatureMeta;
	}

	const level: ProductNutritionFacts["permissions"] = (
		cachedFeature.nutritionFacts as ProductNutritionFacts
	).permissions;

	level ? (Permissions[level].highlighted = true) : undefined;

	const strictPermissions: AiPermissions[] = Permissions.slice(1);

	const strictNutritionFactsData = cachedFeature.nutritionFacts.data.map(
		(block) => {
			switch (block.blockTitle) {
				case "Model & Data":
					return {
						blockTitle: block.blockTitle,
						segmentData: block.segmentData.map(
							stripSegment,
						) as ModelAndDataSegment[],
					};
				case "Privacy & Compliance":
					return {
						blockTitle: block.blockTitle,
						segmentData: block.segmentData.map(
							stripSegment,
						) as PrivacyComplianceSegment[],
					};
				case "Outputs":
					return {
						blockTitle: block.blockTitle,
						segmentData: block.segmentData.map(
							stripSegment,
						) as OutputsSegment[],
					};
				default:
					return block;
			}
		},
	);

	const strictAiInfo: StrictAiInformation = {
		...(AiInformation[0] as StrictAiInformation),
		description:
			level > 0 && level <= strictPermissions.length
				? strictPermissions[level - 1].description
				: "",
		featureName: cachedFeature.nutritionFacts.name,
		modelName: cachedFeature.nutritionFacts.data[0].segmentData[0].value,
		permissionLevel: `LEVEL ${level}`,
	};

	const strictReturn = {
		AiInformation: strictAiInfo,
		dataPermissionLevels: strictPermissions,
		id: id.toLowerCase(),
		lastUpdated: cachedFeature.lastUpdated,
		name: cachedFeature.nutritionFacts.name,
		nutritionFacts: {
			data: strictNutritionFactsData,
			description: cachedFeature.nutritionFacts.description,
			name: cachedFeature.nutritionFacts.name,
		} as StrictNutritionFacts,
		sha256: cachedFeature.sha256,
	} as FeatureMeta;

	return strictReturn;
};

const CopyObject = async (id: string) => {
	try {
		const productObj: FeatureMeta = ExportJSON(id);
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
