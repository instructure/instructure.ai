import { Colors } from "../components";

const BRAND_INDEX = 0;

const getLogo = (product: PendoAPIFeature["product"]["name"]) => {
  const brand = product.split(" ")[BRAND_INDEX].toLowerCase();
  if (Object.hasOwn(Colors, brand)) {
    // oxlint-disable-next-line no-unsafe-type-assertion
    return Colors[brand as keyof typeof Colors];
  }
  return Colors.instructure;
};

export default getLogo;
