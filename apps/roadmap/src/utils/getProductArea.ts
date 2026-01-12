const getProductArea = (area?: string | null): string | undefined => {
  if (!area) {
    return undefined;
  }
  const parts = area.split(" - ");
  const PRODUCT_AREA_INDEX = 1;
  return parts[PRODUCT_AREA_INDEX] || undefined;
};

export default getProductArea;
