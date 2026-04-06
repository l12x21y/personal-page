import { useState, useEffect } from 'react';

/**
 * A custom hook that determines if the application should be in "view-only" mode.
 * It checks for the presence of a `view` query parameter in the URL.
 * @returns `true` if the `view` parameter exists, otherwise `false`.
 */
export const useViewMode = (): boolean => {
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    // This effect runs once on component mount to check the URL.
    const params = new URLSearchParams(window.location.search);
    setIsViewMode(params.has('view'));
  }, []);

  return isViewMode;
};
