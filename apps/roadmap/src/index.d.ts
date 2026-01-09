/// <reference types="@instructure/ui" />

interface SVGInfo {
  color: string;
  SVG: ReactNode;
  title: string;
  viewBox: string;
}

interface SVGProps {
  height?: string;
  width?: string;
  inline?: boolean;
  color?: string;
  valign?: "top" | "middle" | "bottom" | "unset";
}

type ColorSVGProps = SVGProps & {
  children: ReactNode;
  title: string;
  viewBox: string;
};

interface PendoAPI {
  results: PendoAPIFeature[];
}

interface PendoAPIFeature {
  feature: {
    description: string | null;
    labels: string[] | null;
    links:
      | {
          title: string;
          linkUrl: string;
        }[]
      | null;
    stage: string | null;
    title: string;
  };
  product: {
    area: string | null;
    name: string;
    logo: React.FC<SVGProps<SVGSVGElement>> | undefined;
    color: string | undefined;
  };
}

interface RoadmapFeatures {
  stages: string[];
  products: string[];
  productAreas: string[];
  labels: string[];
  features: PendoAPIFeature[];
}

declare module "*.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.svg" {
  const src: string;
  export default src;
}
declare module "*.svg?raw" {
  const src: string;
  export default src;
}
declare module "*.ico" {
  const src: string;
  export default src;
}
declare module "*.png" {
  const src: string;
  export default src;
}
