type PendoAPI = {
  results: PendoAPIFeature[];
}

type PendoAPIFeature = {
  feature: {
    description: string | null;
    labels: string[] | null;
    links: {
      title: string;
      linkUrl: string;
    }[] | null;
    stage: string | null;
    title: string | null;
  };
  product: {
    area: string | null;
    name: string | null;
  };
}

type RoadmapFeatures = {
  stages: string[]
  products: string[]
  productAreas: string[]
  labels: string[]
  features: PendoAPIFeature[]
}

