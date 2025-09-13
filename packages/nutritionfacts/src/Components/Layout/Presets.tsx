import {
	Heading,
	ScreenReaderContent,
	type SelectOptionProps,
	SimpleSelect,
	Spinner,
	View,
} from "@instructure/ui";
import { useId, useState } from "react";
import { brands } from "../../assets";
import type { ProductNutritionFacts } from "../../types";
import { getProductsFromCSV } from "../Import";

type ProductRecords = Record<string, ProductNutritionFacts>;

interface PresetsProps {
	setProduct: React.Dispatch<React.SetStateAction<ProductNutritionFacts>>;
}

const Presets = ({ setProduct }: PresetsProps) => {
	const [safeOptions, setSafeOptions] = useState<SelectOptionProps[]>([]);
	const [products, setProducts] = useState<ProductRecords>({});
	const [groupedOptions, setGroupedOptions] = useState<
		Record<
			string,
			{ renderLabel: React.ReactNode; options: SelectOptionProps[] }
		>
	>({});
	const placeholder = "Select a product";
	const [value, setValue] = useState<string>(placeholder);
	const loadingId = useId();

	const fetchProducts = async () => {
		if (Object.keys(products).length === 0) {
			getProductsFromCSV().then((products) => {
				setProducts(products);
				const grouped: Record<
					string,
					{ renderLabel: React.ReactNode; options: SelectOptionProps[] }
				> = {};
				Object.keys(products).forEach((id) => {
					const rawGroup = products[id].group ?? "Other";
					const group = rawGroup.toLowerCase().trim();
					const brand = brands[group as keyof typeof brands] ?? brands.other;
					if (!grouped[brand.name]) {
						grouped[brand.name] = {
							renderLabel: (
								<>
									<brand.icon color={brand.color} /> {brand.name}
								</>
							),
							options: [],
						};
					}
					grouped[brand.name].options.push({
						id,
						label: products[id].name,
						value: id,
					});
				});

				// Sort each brand's options alphabetically by label
				Object.values(grouped).forEach((group) => {
					group.options.sort((a, b) =>
						(a.label ?? "").localeCompare(b.label ?? ""),
					);
				});

				setGroupedOptions(grouped);

				// Flatten grouped options for fallback (optional)
				const flatOptions = Object.values(grouped)
					.flatMap((g) => g.options)
					.sort((a, b) => (a.label ?? "").localeCompare(b.label ?? ""));
				setSafeOptions(flatOptions);
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
					placeholder={placeholder}
					renderLabel={
						<ScreenReaderContent>Select a product</ScreenReaderContent>
					}
					value={value}
				>
					{Object.keys(groupedOptions).length === 0 ? (
						<SimpleSelect.Option
							id={loadingId}
							isDisabled
							renderBeforeLabel={
								<Spinner renderTitle="Loading" size="x-small" />
							}
							value="loading"
						>
							Loading...
						</SimpleSelect.Option>
					) : (
						Object.entries(groupedOptions).map(
							([group, { renderLabel, options }]) => (
								<SimpleSelect.Group key={group} renderLabel={renderLabel}>
									{options.map((option) => (
										<SimpleSelect.Option
											id={option.id}
											key={option.id}
											value={option.label ? `${group} ${option.label}` : ""}
											renderBeforeLabel=" "
										>
											{option.label}
										</SimpleSelect.Option>
									))}
								</SimpleSelect.Group>
							),
						)
					)}
				</SimpleSelect>
			</View>
			<Heading as="h2" data-print="print-only">
				{value ? value : placeholder}
			</Heading>
		</>
	);
};

export { Presets };
