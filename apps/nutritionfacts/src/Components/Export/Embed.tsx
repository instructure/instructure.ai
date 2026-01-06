import { IconExternalLinkLine } from "@instructure/ui";
import type { SVGIconProps } from "@instructure/ui";
import type { AiInfoFeatureProps } from "@instructure.ai/aiinfo";
import { baseUrl } from "../../assets";
import type { PageLayout } from "../../types.ts";
import { ControlButton } from "./ControlButton.tsx";

const productToText = (product: AiInfoFeatureProps): string => {
  const text = `<h2>${product.group} ${product.name}</h2><p>${product.description}</p>`;
  return text;
};

const Embed = async (product: AiInfoFeatureProps, layout: PageLayout) => {
  setTimeout(async () => {
    const pageElement = document.getElementById("embed");
    let height = 1800;
    let originalWidth: string | undefined;

    if (pageElement) {
      originalWidth = pageElement.style.width;
      pageElement.style.width = "670px";
      height = pageElement.offsetHeight;
    }

    const helperClasses = [
      "border-none", // Tailwind
      "outline-none", // Tailwind
      "border-0", // Bootstrap
    ].join(" ");

    const separator = baseUrl.includes("?") ? "&" : "?";
    const embedCode = `<iframe id="ai-facts" width="670px" height="${height}px" class="${helperClasses}" style="width:670px; outline: none; border:0 none;" allowfullscreen src="${baseUrl}${separator}id=${product.uid}${layout.copyright ? "" : "&copyright=false"}${layout.disclaimer ? "" : "&disclaimer=false"}${layout.revision ? "" : "&revision=false"}"></iframe>
<div class="hidden" id="ai-facts-hidden" style="display:none;">
  ${productToText(product)}
</div>`;
    try {
      await navigator.clipboard.writeText(embedCode);
    } catch (error) {
      let msg = "Failed to copy data to clipboard";
      if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "string") {
        msg = error;
      }
      console.error(msg);
    }

    if (pageElement && originalWidth !== undefined) {
      pageElement.style.width = originalWidth;
    }
  }, 0);
};

const EmbedControl: React.FC<{
  product: AiInfoFeatureProps;
  layout: PageLayout;
  background?: boolean;
  border?: boolean;
  color?: "primary" | "primary-inverse";
}> = ({ product, layout, background, border, color }) => (
  <ControlButton
    background={background}
    border={border}
    color={color}
    Icon={IconExternalLinkLine as React.ElementType<SVGIconProps>}
    label="Copy embed code"
    onClick={() => Embed(product, layout)}
  />
);

export { EmbedControl };
