import { Language } from '../types/schema';

/**
 * Localization Utilities
 * Logic for extracting the correct language field from data objects.
 */

export const getProjectField = (project: any, lang: Language, field: string): string => {
  if (!project) return "";
  const suffix = lang.charAt(0).toUpperCase() + lang.slice(1);
  const primaryKey = `${field}${suffix}`;
  const fallbackKey = `${field}En`;
  return project[primaryKey] || project[fallbackKey] || project[field] || "";
};

export const getStoryField = (story: any, lang: Language, field: string): string => {
  if (!story) return "";
  const suffix = lang.charAt(0).toUpperCase() + lang.slice(1);
  const primaryKey = `${field}${suffix}`;
  const fallbackKey = `${field}En`;
  return story[primaryKey] || story[fallbackKey] || "";
};
