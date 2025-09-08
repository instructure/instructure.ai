import {
	IconCollectionLine,
	Menu,
	type MenuItem,
	type SelectOptionProps,
	Spinner,
	type SVGIconProps,
	View,
} from "@instructure/ui";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { ProductNutritionFacts } from "../../types";
import { getProductsFromCSV } from "../Import";
import { ControlButton } from "./ControlButton";

interface MenuControlProps {
	setProduct: Dispatch<SetStateAction<ProductNutritionFacts>>;
}

type ProductRecords = Record<string, ProductNutritionFacts>;

const MenuControl = ({ setProduct }: MenuControlProps) => {
	const [safeOptions, setSafeOptions] = useState<SelectOptionProps[]>([]);
	const [products, setProducts] = useState<ProductRecords>({});
	const [id, setId] = useState<(string | number)[]>(["Select a product"]);

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

	const handleClick = () => {
		if (Object.keys(safeOptions).length === 0) {
			fetchProducts();
		}
	};

	const handleSelect = (
		_e: React.MouseEvent<Element, MouseEvent>,
		updated: (string | number | undefined)[],
		_selected: boolean | undefined,
		_item: MenuItem,
	) => {
		console.log(_item);
		const id = updated.filter((v): v is string | number => v !== undefined);
		setId(id);
		if (products[id[0]]) setProduct(products[id[0]] as ProductNutritionFacts);
	};

	return (
		<View as="div" id="menu">
			<Menu
				mountNode={() => document.getElementById("menu")}
				offsetY={5}
				placement="top center"
				trigger={
					<ControlButton
						background
						Icon={IconCollectionLine as React.ElementType<SVGIconProps>}
						label="Select preset"
						onClick={handleClick}
					/>
				}
			>
				{Object.keys(safeOptions).length === 0 ? (
					<Menu.Item disabled value="loading">
						<Spinner renderTitle="Loading" size="x-small" /> Loading
					</Menu.Item>
				) : (
					<Menu.Group label="Presets" onSelect={handleSelect} selected={id}>
						{safeOptions.map((option) => (
							<Menu.Item key={option.id} value={option.id}>
								{option.label}
							</Menu.Item>
						))}
					</Menu.Group>
				)}
			</Menu>
		</View>
	);
};
export { MenuControl };
