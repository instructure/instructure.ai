import Logos from "../components/logos";

const getLogo = (product: PendoAPIFeature["product"]["name"]) => {
	const brand = product.split(" ")[0].toLowerCase();
	if (brand in Logos) {
		return Logos[brand as keyof typeof Logos];
	}
	return Logos.instructure;
};

export default getLogo;
