import { Alert } from "@instructure/ui-alerts";
import { IconEducatorsLine } from "@instructure/ui-icons";
import { Select } from "@instructure/ui-select";
import {
	type FocusEvent,
	type SyntheticEvent,
	useRef,
	useState,
	useTransition,
} from "react";
import Roles from "../assets/roles.json" with { type: "json" };

interface RoleOption {
	id: string;
	label: string;
}

interface RoleSelectProps {
	options: RoleOption[];
}

const RoleSelect: React.FC<RoleSelectProps> = () => {
	const sortRoles = (roles) =>
		Object.fromEntries(
			Object.entries(roles)
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([key, arr]) => [
					key,
					arr.slice().sort((a, b) => a.label.localeCompare(b.label)),
				]),
		);
	const options = sortRoles(Roles);

	const [inputValue, setInputValue] = useState<string>("");
	const [isShowingOptions, setIsShowingOptions] = useState<boolean>(false);
	const [highlightedOptionId, setHighlightedOptionId] = useState<string | null>(
		null,
	);
	const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
	const [announcement, setAnnouncement] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const [filteredOptions, setFilteredOptions] = useState(options);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const focusInput = () => {
		if (inputRef.current) {
			inputRef.current.blur();
			inputRef.current.focus();
		}
	};

	const getOptionById = (id) => {
		return Object.values(options)
			.flat()
			.find((o) => o?.id === id);
	};

	const handleInputChange = (event) => {
		const value = event.target.value;
		const newOptions = filterOptions(value, Roles);
		setInputValue(value);
		setFilteredOptions(newOptions);
		setHighlightedOptionId(newOptions.length > 0 ? newOptions[0].id : null);
		setIsShowingOptions(true);
		setSelectedOptionId(value === "" ? null : selectedOptionId);
	};

	const filterOptions = (value, options) => {
		const filteredOptions = {};
		Object.keys(options).forEach((key) => {
			filteredOptions[key] = options[key]?.filter((option) =>
				option.label.toLowerCase().includes(value.toLowerCase()),
			);
		});
		const optionsWithoutEmptyKeys = Object.keys(filteredOptions)
			.filter((k) => filteredOptions[k].length > 0)
			.reduce((acc, k) => {
				acc[k] = filteredOptions[k];
				return acc;
			}, {});
		return optionsWithoutEmptyKeys;
	};

	const handleShowOptions = (_e: SyntheticEvent) => {
		setIsShowingOptions(true);
	};

	const handleHideOptions = (_e: SyntheticEvent) => {
		setIsShowingOptions(false);
		setHighlightedOptionId(null);
		setSelectedOptionId(selectedOptionId ? selectedOptionId : "");
		setAnnouncement("List collapsed.");
	};

	const handleBlur = (_e: FocusEvent) => {
		setHighlightedOptionId(null);
	};

	const handleHighlightOption = (
		event: SyntheticEvent & { type: string; persist: () => void },
		{ id }: { id: string },
	) => {
		event.persist();
		const optionsAvailable = `${options.length} options available.`;
		const nowOpen = !isShowingOptions
			? `List expanded. ${optionsAvailable}`
			: "";
		const option = getOptionById(id).label;
		setHighlightedOptionId(id);
		setInputValue(event.type === "keydown" ? option : inputValue);
		setAnnouncement(`${option} ${nowOpen}`);
	};

	const handleSelectOption = (_e: SyntheticEvent, { id }: { id: string }) => {
		const option = getOptionById(id).label;
		focusInput();
		setSelectedOptionId(id);
		setInputValue(option);
		setIsShowingOptions(false);
		setAnnouncement(`"${option}" selected. List collapsed.`);
	};

	const renderGroup = () => {
		return Object.keys(filteredOptions).map((key) => {
			return (
				<Select.Group key={key} renderLabel={key}>
					{filteredOptions[key].map((option) => (
						<Select.Option
							id={option.id}
							isHighlighted={option.id === highlightedOptionId}
							isSelected={option.id === selectedOptionId}
							key={option.id}
							value={option.label}
						>
							{option.label}
						</Select.Option>
					))}
				</Select.Group>
			);
		});
	};

	return (
		<>
			<Select
				assistiveText="Use arrow keys to navigate options."
				inputRef={(el) => {
					inputRef.current = el;
				}}
				inputValue={inputValue}
				isRequired={true}
				isShowingOptions={isShowingOptions}
				onBlur={handleBlur}
				onRequestHideOptions={handleHideOptions}
				onRequestHighlightOption={handleHighlightOption}
				onRequestSelectOption={handleSelectOption}
				onRequestShowOptions={handleShowOptions}
				placeholder="Student"
				renderBeforeInput={IconEducatorsLine}
				renderLabel="Role"
			>
				{renderGroup()}
			</Select>
			<Alert
				liveRegion={() => document.getElementById("flash-messages")}
				liveRegionPoliteness="assertive"
				role="alert"
				screenReaderOnly
			>
				{announcement}
			</Alert>
		</>
	);
};
export default RoleSelect;
