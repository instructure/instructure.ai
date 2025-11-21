import { Colors } from "../components";

const getLogo = (product: PendoAPIFeature["product"]["name"]) => {
  const brand = product.split(" ")[0].toLowerCase();
  if (brand in Colors) {
    return Colors[brand as keyof typeof Colors];
  }
  return Colors.instructure;
};

export default getLogo;
