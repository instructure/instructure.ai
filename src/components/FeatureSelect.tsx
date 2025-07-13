import { AccessibleContent } from "@instructure/ui-a11y-content";
import { Alert } from "@instructure/ui-alerts";
import { IconLaunchLine } from "@instructure/ui-icons";
import { Select } from "@instructure/ui-select";
import { Tag } from "@instructure/ui-tag";
import { Text } from "@instructure/ui-text";
import { View } from "@instructure/ui-view";
import React, {
	type FocusEvent,
	type KeyboardEvent,
	type SyntheticEvent,
	useRef,
	useState,
} from "react";
import Features, {
	type FeatureInterface,
	type FeaturesType,
} from "../assets/Features";
import type { SignupFormMultiSelectProps } from "./SignupForm";

const FeatureSelect: React.FC<SignupFormMultiSelectProps> = ({
	isDisabled,
	value,
	setValue,
	messages,
	setMessages,
	selectedOptionIds,
	setSelectedOptionIds,
}) => {
	const [options, setOptions] = useState<FeaturesType>(() => {
		const filtered: FeaturesType = {};
		for (const key of Object.keys(Features)) {
			filtered[key] = Features[key].filter(
				(opt: FeatureInterface) => !selectedOptionIds.includes(opt.id),
			);
		}
		return filtered;
	});

	const [isShowingOptions, setIsShowingOptions] = useState<boolean>(false);
	const [highlightedOptionId, setHighlightedOptionId] = useState<string | null>(
		null,
	);
	const [announcement, setAnnouncement] = useState<string | null>(null);
	const [filteredOptions, setFilteredOptions] = useState<FeaturesType>(options);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const isValidFeature = (feature: string): boolean => {
		if (feature === "") return true;
		const allLabels = Object.values(Features)
			.flat()
			.map((feature) => feature.label.toLowerCase());
		return allLabels.includes(feature.toLowerCase());
	};

	const focusInput = (): void => {
		if (inputRef.current) {
			inputRef.current.blur();
			inputRef.current.focus();
		}
	};

	const handleKeyDown = (event: KeyboardEvent<Element>) => {
		if (
			(event.key === "Backspace" || event.key === "Delete") &&
			value === "" &&
			selectedOptionIds.length > 0
		) {
			setHighlightedOptionId(null);
			setSelectedOptionIds(selectedOptionIds.slice(0, -1));
		}
	};

	const handleShowOptions = (_e: SyntheticEvent): void => {
		setIsShowingOptions(true);
		setMessages([]);
	};

	const handleSelectOption = (
		_e: SyntheticEvent,
		data: { id?: string },
	): void => {
		const { id } = data;
		const option = id ? (getOptionById(id)?.label ?? "") : "";
		focusInput();

		setSelectedOptionIds(
			id && !selectedOptionIds.includes(id)
				? [...selectedOptionIds, id]
				: selectedOptionIds,
		);

		if (id) {
			setOptions((prev) => {
				const updated: FeaturesType = {};
				for (const key of Object.keys(prev)) {
					updated[key] = prev[key].filter(
						(opt: FeatureInterface) => opt.id !== id,
					);
				}
				return updated;
			});
		}

		setMessages([]);
		setValue("");
		setIsShowingOptions(false);
		setAnnouncement(`"${option}" selected. List collapsed.`);
	};

	const handleBlur = (_e: FocusEvent<HTMLInputElement>): void => {
		setHighlightedOptionId(null);
		if (selectedOptionIds.length === 0) {
			setMessages([
				{
					text: "Feature is required.",
					type: "error",
				},
			]);
		} else if (!isValidFeature(value)) {
			setMessages([
				{
					text: "Select a valid feature.",
					type: "error",
				},
			]);
		} else {
			setMessages([]);
		}
	};

	const getOptionById = (id: string): FeatureInterface | undefined => {
		return Object.values(Features)
			.flat()
			.find((o) => o?.id === id);
	};

	const renderGroupLabel = (key: string) => {
		const group = filteredOptions[key];
		const BrandIcon = group?.[0]?.colorIcon;
		return (
			<>
				{BrandIcon && <BrandIcon />}
				<View margin="0 0 0 small">
					<Text>{key}</Text>
				</View>
			</>
		);
	};

	const renderGroup = (): React.ReactNode => {
		return Object.keys(filteredOptions)
			.filter((key) => filteredOptions[key] && filteredOptions[key].length > 0)
			.map((key) => (
				<Select.Group key={key} renderLabel={renderGroupLabel(key)}>
					{filteredOptions[key].map((option: FeatureInterface) => (
						<Select.Option
							id={option.id}
							isHighlighted={option.id === highlightedOptionId}
							key={option.id}
							value={option.label}
						>
							<View margin="0 0 0 medium">{option.label}</View>
						</Select.Option>
					))}
				</Select.Group>
			));
	};

	const dismissTag = (e: React.MouseEvent, tag: string) => {
		e.stopPropagation();
		e.preventDefault();
		setSelectedOptionIds(selectedOptionIds.filter((id) => id !== tag));
		setHighlightedOptionId(null);
		const option = getOptionById(tag);
		if (option) {
			setAnnouncement(`${option.label} removed`);
			const exists = Object.values(options)
				.flat()
				.some((o) => o.id === option.id);
			if (!exists && typeof setOptions === "function") {
				const groupKey = Object.keys(Features).find((key) =>
					Features[key].some((opt: FeatureInterface) => opt.id === option.id),
				);
				if (groupKey) {
					const originalGroup = Features[groupKey];
					const insertIndex = originalGroup.findIndex(
						(opt: FeatureInterface) => opt.id === option.id,
					);
					const newGroup = [...options[groupKey]];
					const alreadyIndex = newGroup.findIndex(
						(opt) => opt.id === option.id,
					);
					if (alreadyIndex !== -1) newGroup.splice(alreadyIndex, 1);
					newGroup.splice(insertIndex, 0, option);
					setOptions({
						...options,
						[groupKey]: newGroup,
					});
				}
			}
		}

		inputRef.current?.focus();
	};

	const renderTags = (): (React.JSX.Element | null)[] => {
		return selectedOptionIds.map(
			(id: string, index: number): React.JSX.Element | null => {
				const option = getOptionById(id);
				if (!option) return null;
				const groupKey = Object.keys(Features).find((key) =>
					Features[key].some((opt: FeatureInterface) => opt.id === id),
				);
				const BrandIcon =
					groupKey && Features[groupKey][0]?.colorIcon
						? Features[groupKey][0].colorIcon
						: null;
				return (
					<Tag
						dismissible
						key={id}
						margin={
							index > 0 ? "xxx-small xx-small xxx-small 0" : "0 xx-small 0 0"
						}
						onClick={(e: React.MouseEvent) => dismissTag(e, id)}
						text={
							<AccessibleContent alt={`Remove ${option.label}`}>
								{BrandIcon && <BrandIcon />} {option.label}
							</AccessibleContent>
						}
					/>
				);
			},
		);
	};

	const handleHideOptions = (_e: React.SyntheticEvent) => {
		setIsShowingOptions(false);
		setHighlightedOptionId(null);
		setAnnouncement("List collapsed.");
		if (value === "") {
			setFilteredOptions(options);
		}
		focusInput();
	};

	const handleHighlightOption = (
		event: SyntheticEvent & { type: string; persist: () => void },
		data: { id?: string; direction?: 1 | -1 },
	): void => {
		event.persist();
		const { id } = data;
		const optionsAvailable = `${Object.values(options).flat().length} options available.`;
		const nowOpen = !isShowingOptions
			? `List expanded. ${optionsAvailable}`
			: "";
		const option = id ? (getOptionById(id)?.label ?? "") : "";
		setHighlightedOptionId(id ?? null);
		setValue(event.type === "keydown" && option ? option : value);
		setAnnouncement(`${option} ${nowOpen}`);
	};

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const value = event.target.value;
		const newOptions = filterOptions(value, options);
		setValue(value);
		setFilteredOptions(newOptions);
		const firstKey = Object.keys(newOptions)[0];
		const firstOption = firstKey ? newOptions[firstKey][0] : null;
		setHighlightedOptionId(firstOption ? firstOption.id : null);
		setIsShowingOptions(true);
		setMessages([]);
	};

	const filterOptions = (
		value: string,
		options: FeaturesType,
	): FeaturesType => {
		const filteredOptions: FeaturesType = {};
		Object.keys(options).forEach((key) => {
			filteredOptions[key] = options[key]?.filter((option) =>
				option.label.toLowerCase().includes(value.toLowerCase()),
			);
		});
		const optionsWithoutEmptyKeys = Object.keys(filteredOptions)
			.filter((k) => filteredOptions[k].length > 0)
			.reduce<FeaturesType>((acc, k) => {
				acc[k] = filteredOptions[k];
				return acc;
			}, {});
		return optionsWithoutEmptyKeys;
	};

	return (
		<>
			<Select
				assistiveText="Use arrow keys to navigate options."
				disabled={isDisabled}
				inputRef={(el: HTMLInputElement | null) => {
					inputRef.current = el;
				}}
				inputValue={value}
				isShowingOptions={isShowingOptions}
				messages={messages}
				name="features"
				onBlur={handleBlur}
				onInputChange={handleInputChange}
				onKeyDown={handleKeyDown}
				onRequestHideOptions={handleHideOptions}
				onRequestHighlightOption={handleHighlightOption}
				onRequestSelectOption={handleSelectOption}
				onRequestShowOptions={handleShowOptions}
				placeholder={selectedOptionIds.length > 0 ? "" : "Ignite Agent"}
				renderBeforeInput={
					selectedOptionIds.length > 0 ? renderTags() : IconLaunchLine
				}
				renderLabel="Features"
				shouldNotWrap={selectedOptionIds.length < 1}
			>
				{renderGroup()}
			</Select>
			<Alert
				liveRegion={() => {
					const el = document.getElementById("flash-messages");
					if (!el)
						throw new Error('Element with id "flash-messages" not found');
					return el;
				}}
				liveRegionPoliteness="assertive"
				screenReaderOnly
			>
				{announcement}
			</Alert>
		</>
	);
};

export default FeatureSelect;
