const getProductArea = (area?: string | null): string | undefined => {
	if (!area) return undefined;
	const parts = area.split(" - ");
	return parts[1] || undefined;
};

export default getProductArea;
