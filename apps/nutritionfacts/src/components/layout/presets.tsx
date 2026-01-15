import { ScreenReaderContent, SimpleSelect, View } from "@instructure/ui";
import { type SelectOptionProps } from "@instructure/ui";
import { AiInfo } from "@instructure.ai/aiinfo";
import { type AiInfoFeatureProps, type AiInfoProps } from "@instructure.ai/aiinfo";
import { useCallback, useEffect, useState } from "react";
import { brands } from "../../assets";

interface PresetsProps {
  product: AiInfoFeatureProps | undefined;
  setProduct: React.Dispatch<React.SetStateAction<AiInfoFeatureProps | undefined>>;
}

const Presets = ({ setProduct, product }: PresetsProps) => {
  const [products, setProducts] = useState<AiInfoProps>({});
  const [groupedOptions, setGroupedOptions] = useState<
    Record<string, { renderLabel: React.ReactNode; options: SelectOptionProps[] }>
  >({});
  const placeholder = "Select a feature";
  const [value, setValue] = useState<string>(product ? product.name : placeholder);

  const fetchProducts = useCallback(() => {
    if (Object.keys(products).length === 0) {
      // oxlint-disable-next-line no-unused-vars
      const { nutritionFacts, dataPermissionLevels, aiInformation, ...productEntries } = AiInfo;

      setProducts(productEntries);
      const grouped: Record<
        string,
        { renderLabel: React.ReactNode; options: SelectOptionProps[] }
      > = {};
      Object.keys(productEntries).forEach((id) => {
        const rawGroup = productEntries[id].group ?? "Other";
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
          label: productEntries[id].name,
          value: id,
        });
      });

      Object.values(grouped).forEach((group) => {
        group.options.sort((a, b) => (a.label ?? "").localeCompare(b.label ?? ""));
      });

      setGroupedOptions(grouped);
    }
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSelect = (
    _event: React.SyntheticEvent,
    data: { id?: string; value?: string | number },
  ) => {
    if (data.value && typeof data.value === "string") {
      setValue(data.value);
    }
    if (data.id && products[data.id]) {
      setProduct(products[data.id]);
      const url = new URL(window.location.href);
      url.searchParams.set("id", data.id);
      window.history.replaceState({}, "", url.toString());
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
