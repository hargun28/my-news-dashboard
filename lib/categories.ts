export const CATEGORY_MAP: Record<string, string> = {
  technology: "technology",
  sports: "sports",
  business: "business",
  politics: "general", // NewsAPI has no “politics” category, so use general + keyword
};

export const VALID_SLUGS = Object.keys(CATEGORY_MAP);
