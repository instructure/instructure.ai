import {
	Heading,
	ScreenReaderContent,
	type SelectOptionProps,
	SimpleSelect,
	Spinner,
	View,
} from "@instructure/ui";
import { useState } from "react";
import type { ProductNutritionFacts } from "../../types";
import { getProductsFromCSV } from "../Import";

type ProductRecords = Record<string, ProductNutritionFacts>;

interface PresetsProps {
	setProduct: React.Dispatch<React.SetStateAction<ProductNutritionFacts>>;
}

const Presets = ({ setProduct }: PresetsProps) => {
	const [safeOptions, setSafeOptions] = useState<SelectOptionProps[]>([]);
	const [products, setProducts] = useState<ProductRecords>({});
	const [value, setValue] = useState<string>("Select a product");

	const fetchProducts = async () => {
		if (Object.keys(products).length === 0) {
			getProductsFromCSV().then((products) => {
				setProducts(products);
				setSafeOptions(
					Object.keys(products)
						.map((id) => ({
							id,
							label: products[id].name,
							value: id,
						}))
						.sort((a, b) => a.label.localeCompare(b.label)),
				);
			});
		}
	};

	const handleShowOptions = () => {
		if (Object.keys(safeOptions).length === 0) {
			fetchProducts();
		}
	};

	const handleSelect = (
		_event: React.SyntheticEvent<Element, Event>,
		data: { id?: string; value?: string | number },
	) => {
		if (data.value && typeof data.value === "string") {
			setValue(data.value);
		}
		if (data.id && products[data.id]) {
			setProduct(products[data.id]);
		}
	};
	return (
		<>
			<View data-print="hidden">
				<SimpleSelect
					assistiveText="Use arrow keys to navigate options."
					onChange={handleSelect}
					onShowOptions={handleShowOptions}
					placeholder="Select a product"
					renderLabel={
						<ScreenReaderContent>Select a product</ScreenReaderContent>
					}
					value={value}
				>
					{Object.keys(safeOptions).length === 0 ? (
						<SimpleSelect.Option
							id="loading"
							isDisabled
							renderBeforeLabel={
								<Spinner renderTitle="Loading" size="x-small" />
							}
							value="loading"
						>
							Loading...
						</SimpleSelect.Option>
					) : (
						safeOptions.map((option) => (
							<SimpleSelect.Option
								id={option.id}
								key={option.id}
								value={option.label ?? ""}
							>
								{option.label}
							</SimpleSelect.Option>
						))
					)}
				</SimpleSelect>
			</View>
			<Heading as="h2" data-print="print-only">
				{value}
			</Heading>
		</>
	);
};

export { Presets };
