/**
 * Navigate to a specified URL using window.location.href
 * @param url - The URL or path to navigate to
 * @param delay - Optional delay in milliseconds before navigating (default: 0)
 */
export const navigate = (url: string, delay: number = 0): void => {
  if (typeof window !== "undefined") {
    if (delay > 0) {
      setTimeout(() => {
        window.location.href = url;
      }, delay);
    } else {
      window.location.href = url;
    }
  }
};

/**
 * Navigate to a specified URL after 3 seconds
 * @param url - The URL or path to navigate to
 */
export const navigateAfter3Seconds = (url: string): void => {
  navigate(url, 3000);
};

/**
 * Navigate based on a URL parameter
 * @param paramName - The name of the URL parameter to read
 * @param defaultUrl - Default URL if parameter is not found
 * @param delay - Optional delay in milliseconds before navigating (default: 0)
 */
export const navigateFromParameter = (
  paramName: string,
  defaultUrl: string = "/",
  delay: number = 0
): void => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const url = params.get(paramName) || defaultUrl;
    navigate(url, delay);
  }
};

/**
 * Get a URL parameter value
 * @param paramName - The name of the parameter to retrieve
 * @returns The parameter value or null if not found
 */
export const getUrlParameter = (paramName: string): string | null => {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName);
};
