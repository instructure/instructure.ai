const hasProp = <T extends object, K extends PropertyKey>(
  obj: T,
  prop: K,
): obj is T & Record<K, unknown> => Object.hasOwn(obj, prop);

// oxc-ignore-start lint/suspicious/noExplicitAny: `any` is part of the type guard
const isPendoAPIFeature = (obj: unknown): obj is PendoAPIFeature => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    hasProp(obj, "feature") &&
    typeof (obj as { feature: unknown }).feature === "object" &&
    (obj as { feature: unknown }).feature !== null &&
    hasProp((obj as { feature: any }).feature, "stage") &&
    hasProp((obj as { feature: any }).feature, "title") &&
    hasProp(obj, "product") &&
    typeof (obj as { product: unknown }).product === "object" &&
    (obj as { product: unknown }).product !== null &&
    hasProp((obj as { product: any }).product, "name") &&
    hasProp((obj as { product: any }).product, "area")
  );
};
// oxc-ignore-end lint/suspicious/noExplicitAny: `any` is part of the type guard

const isPendoAPI = (obj: unknown): obj is PendoAPI => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    hasProp(obj, "results") &&
    Array.isArray((obj as { results: unknown }).results) &&
    // oxc-ignore lint/suspicious/noExplicitAny: `any` is part of the type guard
    (obj as { results: any[] }).results.every(isPendoAPIFeature)
  );
};

const paramsToPendo = (params: string | null): RoadmapFeatures | undefined => {
  if (!params) {
    return;
  }

  let p: unknown;
  try {
    p = JSON.parse(decodeURIComponent(params));
  } catch {
    return;
  }

  if (!isPendoAPI(p)) {
    return;
  }

  const stages = [
    ...new Set(p.results.map((result) => result.feature.stage)),
  ].filter(Boolean) as string[];
  const products = [
    ...new Set(p.results.map((result) => result.product.name)),
  ].filter(Boolean) as string[];
  const productAreas = [
    ...new Set(p.results.map((result) => result.product.area)),
  ].filter(Boolean) as string[];
  const labels = [
    ...new Set(p.results.flatMap((result) => result.feature.labels)),
  ].filter(Boolean) as string[];
  const features = p.results;

  const roadmap: RoadmapFeatures = {
    features,
    labels,
    productAreas,
    products,
    stages,
  };

  if (
    Array.isArray(roadmap.stages) &&
    Array.isArray(roadmap.products) &&
    Array.isArray(roadmap.productAreas) &&
    Array.isArray(roadmap.labels) &&
    Array.isArray(roadmap.features)
  ) {
    return roadmap;
  }

  return;
};
export default paramsToPendo;
