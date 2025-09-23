type PendoAPI = {
  results: PendoFeature[];
}

type PendoFeature = {
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