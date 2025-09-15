import { Flex, Heading, Text, View } from "@instructure/ui";
import type { Dispatch, FC, SetStateAction } from "react";
import { Permissions } from "../../assets";
import type { PageLayout, ProductNutritionFacts } from "../../types.ts";
import { Presets } from "./Presets";

const NutritionFactsForm: FC<{
	product: ProductNutritionFacts;
	layout: PageLayout;
	setProduct: Dispatch<SetStateAction<ProductNutritionFacts>>;
}> = ({ product, layout, setProduct }) => {
	const getRevisionDate = () => {
		const d = new Date();
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		return `${yyyy}.${mm}.${dd}`;
	};
	const params = new URLSearchParams(window.location.search);
	const noParams = params.size === 0;

	const productPermissions =
		Permissions[product.permissions as keyof typeof Permissions];

	const hasPermissions =
		typeof productPermissions === "object" &&
		productPermissions !== null &&
		"name" in productPermissions &&
		"title" in productPermissions &&
		"description" in productPermissions &&
		typeof productPermissions.name === "string" &&
		typeof productPermissions.title === "string" &&
		typeof productPermissions.description === "string";

	const heading =
		product.group && product.group !== "other"
			? `${product.group} ${product.name}`
			: (product.name ?? "No product selected");

	return (
		<>
			<Flex alignItems="start" direction="row">
				<Flex.Item shouldGrow shouldShrink>
					<Heading
						aiVariant="stacked"
						as="h1"
						data-print="no-background"
						margin="0 0 small"
					>
						Nutrition Facts
					</Heading>
				</Flex.Item>
			</Flex>
			<Flex alignItems="start" direction="row">
				<Flex.Item shouldGrow shouldShrink>
					<View as="div" borderWidth="medium 0 0 0" padding="medium 0 0">
						{noParams ? (
							<Presets setProduct={setProduct} />
						) : (
							<Heading as="h2">{heading}</Heading>
						)}
					</View>
					<Heading as="h3" margin="medium 0 xx-small 0">
						Description
					</Heading>
					<Text size="small">{product.description}</Text>
					{product.data.map((block) => (
						<View as="div" key={block.blockTitle}>
							<Heading as="h3" margin="medium 0 0">
								{block.blockTitle}
							</Heading>
							{block.segmentData.map((segment) => (
								<View
									as="div"
									borderRadius="medium"
									borderWidth="small"
									data-print="no-break"
									key={segment.segmentTitle}
									margin="small 0"
									padding="small"
								>
									<Heading as="h4">{segment.segmentTitle}</Heading>
									<View as="div" margin="0 0 x-small">
										<Text color="secondary" size="contentSmall">
											{segment.description}
										</Text>
									</View>
									{segment.valueHint && (
										<View as="div">
											<Text>{segment.value}</Text>
										</View>
									)}
									<View as="div">
										{segment.descriptionHint && (
											<Text size="small">{segment.valueDescription}</Text>
										)}
									</View>
								</View>
							))}
						</View>
					))}
					{layout.permissions && hasPermissions && (
						<>
							<Heading as="h3" margin="medium 0 0">
								Permission Level
							</Heading>
							<View
								as="div"
								borderRadius="medium"
								borderWidth="small"
								data-print="no-break"
								margin="small 0"
								padding="small"
							>
								<Heading as="h4">{productPermissions.name}</Heading>
								{productPermissions.descriptionHint && (
									<View as="div" margin="0 0 x-small">
										<Text>{productPermissions.descriptionHint}</Text>
									</View>
								)}
								<View as="div">
									<Text size="small">{productPermissions.description}</Text>
								</View>
							</View>
						</>
					)}
					<View as="div" margin="0 auto" maxWidth="66%" textAlign="center">
						{layout.revision && (
							<Text
								data-print={layout.revision ? "" : "hidden"}
								variant="contentSmall"
								color="secondary"
							>
								Revision:{" "}
								{product.revision ? product.revision : getRevisionDate()}
							</Text>
						)}
					</View>
				</Flex.Item>
			</Flex>
		</>
	);
};

export { NutritionFactsForm };
