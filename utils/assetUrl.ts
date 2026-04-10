/**
 * Convert a relative asset URL to an absolute URL with proper base path
 * For relative URLs like "Personal Info/Cover.JPG", convert to "/personal-page/Personal Info/Cover.JPG" in production
 * @param url - The relative URL (relative asset path)
 * @returns The properly formatted URL with base path
 */
export function getAssetUrl(url: string): string {
  if (!url) return '';
  
  // If it's already absolute (starts with /, data:, or http), return as-is
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('http')) {
    return url;
  }
  
  // Get the base URL from Vite
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  // Combine base URL with the asset path
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBase}/${url}`;
}
