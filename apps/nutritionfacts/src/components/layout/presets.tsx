import { ScreenReaderContent, SimpleSelect, View } from "@instructure/ui";
import { type SelectOptionProps } from "@instructure/ui";
import { AiInfo } from "@instructure.ai/aiinfo";
import { type AiInfoFeatureProps, type AiInfoProps } from "@instructure.ai/aiinfo";
import { useMemo, useState } from "react";
import { brands } from "../../assets";

const NON_PRODUCT_KEYS = new Set(["nutritionFacts", "dataPermissionLevels", "aiInformation"]);

interface PresetsProps {
  product: AiInfoFeatureProps | undefined;
  setProduct: React.Dispatch<React.SetStateAction<AiInfoFeatureProps | undefined>>;
}

const Presets = ({ setProduct, product }: PresetsProps) => {
  const products = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(AiInfo).filter(([key]) => !NON_PRODUCT_KEYS.has(key)),
      ) as Omit<AiInfoProps, "nutritionFacts" | "dataPermissionLevels" | "aiInformation">,
    [],
  );
  const groupedOptions = useMemo(() => {
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
          options: [],
          renderLabel: (
            <>
              <brand.icon color={brand.color} /> {brand.name}
            </>
          ),
        };
      }
      grouped[brand.name].options.push({
        id,
        label: products[id].name,
        value: id,
      });
    });

    Object.values(grouped).forEach((group) => {
      group.options.sort((a, b) => (a.label ?? "").localeCompare(b.label ?? ""));
    });
    return grouped;
  }, [products]);
  const placeholder = "Select a feature";
  const [value, setValue] = useState<string>(product ? product.name : placeholder);

  const handleSelect = (
    _event: React.SyntheticEvent,
    data: { id?: string; value?: string | number },
  ) => {
    if (data.value && typeof data.value === "string") {
      setValue(data.value);
    }
    if (data.id && products[data.id]) {
      setProduct(products[data.id]);
      const url = new URL(globalThis.location.href);
      url.searchParams.set("id", data.id);
      globalThis.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <View data-print="hidden">
      <SimpleSelect
        assistiveText="Use arrow keys to navigate options."
        onChange={handleSelect}
        placeholder={placeholder}
        renderLabel={<ScreenReaderContent>Select a product</ScreenReaderContent>}
        value={value}
        visibleOptionsCount={8}
      >
        {Object.entries(groupedOptions)
          .toSorted(([a], [b]) => a.localeCompare(b))
          .map(([group, { renderLabel, options }]) => (
            <SimpleSelect.Group key={group} renderLabel={renderLabel}>
              {options.map((option) => (
                <SimpleSelect.Option
                  id={option.id}
                  key={option.id}
                  renderBeforeLabel=" "
                  value={option.id}
                >
                  {option.label}
                </SimpleSelect.Option>
              ))}
            </SimpleSelect.Group>
          ))}
      </SimpleSelect>
    </View>
  );
};

export { Presets };
