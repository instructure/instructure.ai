import { Logos } from "../components/logos";

const BRAND_INDEX = 0;

const getLogo = (product: PendoAPIFeature["product"]["name"]) => {
  const brand = product.trim().split(" ")[BRAND_INDEX].toLowerCase();
  if (Object.hasOwn(Logos, brand)) {
    // oxlint-disable-next-line no-unsafe-type-assertion
    return Logos[brand as keyof typeof Logos];
  }
  return Logos.instructure;
};

export default getLogo;
