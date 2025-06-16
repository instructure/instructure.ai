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

type RolesMap = Record<string, RoleOption[]>;

type RoleSelectProps = {};

const RoleSelect: React.FC<RoleSelectProps> = () => {
	const sortRoles = (roles: RolesMap): RolesMap =>
		Object.fromEntries(
			Object.entries(roles)
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([key, arr]) => [
					key,
					arr.slice().sort((a, b) => a.label.localeCompare(b.label)),
				]),
		);

	const options: RolesMap = sortRoles(Roles as RolesMap);

	const [inputValue, setInputValue] = useState<string>("");
	const [isShowingOptions, setIsShowingOptions] = useState<boolean>(false);
	const [highlightedOptionId, setHighlightedOptionId] = useState<string | null>(
		null,
	);
	const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
	const [announcement, setAnnouncement] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const [filteredOptions, setFilteredOptions] = useState<RolesMap>(options);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const focusInput = (): void => {
		if (inputRef.current) {
			inputRef.current.blur();
			inputRef.current.focus();
		}
	};

	const getOptionById = (id: string): RoleOption | undefined => {
		return Object.values(options)
			.flat()
			.find((o) => o?.id === id);
	};

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const value = event.target.value;
		const newOptions = filterOptions(value, Roles as RolesMap);
		setInputValue(value);
		setFilteredOptions(newOptions);
		const firstKey = Object.keys(newOptions)[0];
		const firstOption = firstKey ? newOptions[firstKey][0] : null;
		setHighlightedOptionId(firstOption ? firstOption.id : null);
		setIsShowingOptions(true);
		setSelectedOptionId(value === "" ? null : selectedOptionId);
	};

	const filterOptions = (value: string, options: RolesMap): RolesMap => {
		const filteredOptions: RolesMap = {};
		Object.keys(options).forEach((key) => {
			filteredOptions[key] = options[key]?.filter((option) =>
				option.label.toLowerCase().includes(value.toLowerCase()),
			);
		});
		const optionsWithoutEmptyKeys = Object.keys(filteredOptions)
			.filter((k) => filteredOptions[k].length > 0)
			.reduce<RolesMap>((acc, k) => {
				acc[k] = filteredOptions[k];
				return acc;
			}, {});
		return optionsWithoutEmptyKeys;
	};

	const handleShowOptions = (_e: SyntheticEvent): void => {
		setIsShowingOptions(true);
	};

	const handleHideOptions = (_e: SyntheticEvent): void => {
		setIsShowingOptions(false);
		setHighlightedOptionId(null);
		setSelectedOptionId(selectedOptionId ? selectedOptionId : "");
		setAnnouncement("List collapsed.");
	};

	const handleBlur = (_e: FocusEvent): void => {
		setHighlightedOptionId(null);
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
		setInputValue(event.type === "keydown" && option ? option : inputValue);
		setAnnouncement(`${option} ${nowOpen}`);
	};

	const handleSelectOption = (
		_e: SyntheticEvent,
		data: { id?: string },
	): void => {
		const { id } = data;
		const option = id ? (getOptionById(id)?.label ?? "") : "";
		focusInput();
		setSelectedOptionId(id ?? null);
		setInputValue(option);
		setIsShowingOptions(false);
		setAnnouncement(`"${option}" selected. List collapsed.`);
	};

	const renderGroup = (): React.ReactNode => {
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
				inputRef={(el: HTMLInputElement | null) => {
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
export default RoleSelect;
