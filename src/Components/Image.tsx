import { IconImageLine, type SVGIconProps } from "@instructure/ui";
import { snapdom } from "@zumer/snapdom";
import type { ProductNutritionFacts } from "../types.ts";
import { ControlButton } from "./ControlButton.tsx";

const Image = async ({ product }: { product: ProductNutritionFacts }) => {
	const el = document.getElementById("page");
	if (!el) {
		console.error("#page not found");
		return;
	}
	const prevStyle = el.getAttribute("style") ?? "";

	try {
		el.style.height = "auto";
		await new Promise((r) =>
			requestAnimationFrame(() => requestAnimationFrame(r)),
		);
		await snapdom.download(el, {
			exclude: ['[data-print*="hidden"]'],
			filename: `${product.name}-nutrition-facts`,
			scale: 0.5,
			type: "jpg",
		});
	} catch (err) {
		console.error("snapdom failed:", err);
	}
	prevStyle ? el.setAttribute("style", prevStyle) : el.removeAttribute("style");
};

const ImageControl: React.FC<{ product: ProductNutritionFacts }> = ({
	product,
}) => (
	<ControlButton
		Icon={IconImageLine as React.ElementType<SVGIconProps>}
		label="Save as image"
		onClick={() => Image({ product })}
	/>
);

export { ImageControl };
