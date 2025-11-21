type BrandColor =
  | "canvas"
  | "instructure"
  | "mastery"
  | "igniteai"
  | "parchment";

type Colors = Record<BrandColor, string>;

const colors: Colors = {
  canvas: "#D42E21",
  igniteai: "#9E58BD",
  instructure: "#0E1721",
  mastery: "#3C8645",
  parchment: "#4279B6",
};

export { colors, type Colors, type BrandColor };
