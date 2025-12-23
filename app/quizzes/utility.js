import { CATEGORY_ICONS, CATEGORY_ICON_MAP } from "./constants";

export const getCategoryIcon = (name) => {
  const defaultIcon = CATEGORY_ICONS[Math.floor(Math.random() * CATEGORY_ICONS.length)];
  const key = name.toLowerCase();
  return CATEGORY_ICON_MAP[key] || defaultIcon;
};

export const filterCategories = (categories, searchQuery) => {
  if (searchQuery.trim() === "") return categories;
  
  return categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

