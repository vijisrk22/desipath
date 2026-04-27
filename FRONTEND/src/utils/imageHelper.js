import { BASE_URL } from "./api";

/**
 * Utility to resolve image URLs for the Desipath marketplace.
 * Handles:
 * 1. Base64 data URLs
 * 2. External full URLs (e.g., placehold.co)
 * 3. Relative server paths (prepending the correct API base URL)
 */
export const getFullImageUrl = (path) => {
  if (!path) return "";
  
  let cleanPath = String(path).trim();
  
  // Aggressively remove surrounding quotes, backslashes and brackets
  // This handles cases like: "\"[\"https://...\"]\"" or "[\"https://...\"]"
  let prevPath = "";
  while (cleanPath !== prevPath) {
    prevPath = cleanPath;
    cleanPath = cleanPath.replace(/^["'\\\[\]]+|["'\\\[\]]+$/g, '');
  }
  
  // Final check for protocol
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://") || cleanPath.startsWith("data:") || cleanPath.startsWith("blob:")) {
    return cleanPath;
  }
  
  const finalPath = cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath;
  
  return `${BASE_URL}/${finalPath}`;
};
