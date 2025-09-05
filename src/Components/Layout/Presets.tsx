import {
	ScreenReaderContent,
	Select,
	type SelectOptionProps,
	Spinner,
} from "@instructure/ui";
import { useRef, useState, useTransition } from "react";
import type { ProductNutritionFacts } from "../../types";
import { getProductsFromCSV } from "../Import";

type ProductRecords = Record<string, ProductNutritionFacts>;

interface PresetsProps {
	setProduct: React.Dispatch<React.SetStateAction<ProductNutritionFacts>>;
}

const Presets = ({ setProduct }: PresetsProps) => {
	const safePlaceholder = "Select a product";

	const thisRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
	const [inputValue, setInputValue] = useState<string | undefined>(undefined);
	const [isShowingOptions, setIsShowingOptions] = useState<boolean>(false);
	const [highlightedOptionId, setHighlightedOptionId] = useState<string | null>(
		null,
	);
	const [safeOptions, setSafeOptions] = useState<SelectOptionProps[]>([]);

	const [selectedOptionId, setSelectedOptionId] = useState<string>(
		safeOptions[0]?.id ?? "",
	);
	const [isLoading, startLoading] = useTransition();
	const [products, setProducts] = useState<ProductRecords>({});

	const fetchProducts = async () => {
		if (Object.keys(products).length === 0) {
			startLoading(() => {
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
			});
		}
	};

	const focusInput = () => thisRef.current?.focus();

	const getOptionById = (queryId: string) => {
		return safeOptions.find(({ id }) => id === queryId);
	};

	const handleShowOptions = (event: React.SyntheticEvent<Element, Event>) => {
		setIsShowingOptions(true);
		if (safeOptions.length === 0 && !isLoading) {
			fetchProducts();
		}
		const keyEvent = event as React.KeyboardEvent<Element>;
		switch (keyEvent.key) {
			case "ArrowDown":
				return handleHighlightOption(event, { id: safeOptions[0].id });
			case "ArrowUp":
				return handleHighlightOption(event, {
					id: safeOptions[safeOptions.length - 1].id,
				});
		}
	};

	const handleHideOptions = () => {
		const option = getOptionById(selectedOptionId);
		const optionLabel = option?.label ?? "";
		setIsShowingOptions(false);
		setHighlightedOptionId(null);
		setSelectedOptionId(selectedOptionId ? selectedOptionId : "");
		setInputValue(optionLabel);
	};

	const handleSelectBlur = () => setHighlightedOptionId(null);

	const handleHighlightOption = (
		_event: React.SyntheticEvent<Element, Event>,
		data: { id?: string; direction?: -1 | 1 },
	) => {
		if (data.id) {
			setHighlightedOptionId(data.id);
			setInputValue(inputValue);
		}
	};

	const handleSelectOption = (
		_event: React.SyntheticEvent<Element, Event>,
		{ id }: { id?: string },
	) => {
		if (!id) return;
		focusInput();
		const option = getOptionById(id);
		if (!option) return;
		setSelectedOptionId(id);
		setInputValue(option.label);
		setIsShowingOptions(false);
		if (products[id]) setProduct(products[id]);
		handleBlur();
	};

	const handleBlur = () => thisRef.current?.blur();

	return (
		<Select
			assistiveText="Use arrow keys to navigate options."
			inputRef={(el) => {
				thisRef.current = el;
			}}
			inputValue={inputValue}
			isShowingOptions={isShowingOptions}
			onBlur={handleSelectBlur}
			onFocus={focusInput}
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					handleSelectBlur();
					handleBlur();
				}
			}}
			onRequestHideOptions={handleHideOptions}
			onRequestHighlightOption={handleHighlightOption}
			onRequestSelectOption={handleSelectOption}
			onRequestShowOptions={handleShowOptions}
			placeholder={safePlaceholder}
			renderLabel={<ScreenReaderContent>{safePlaceholder}</ScreenReaderContent>}
		>
			{Object.keys(safeOptions).length === 0 ? (
				<Select.Option id="loading">
					<Spinner renderTitle="Loading" size="x-small" />
					Loading...
				</Select.Option>
			) : (
				safeOptions.map((option) => (
					<Select.Option
						id={option.id}
						isHighlighted={option.id === highlightedOptionId}
						isSelected={option.id === selectedOptionId}
						key={option.id}
					>
						{option.label}
					</Select.Option>
				))
			)}
		</Select>
	);
};

export { Presets };
