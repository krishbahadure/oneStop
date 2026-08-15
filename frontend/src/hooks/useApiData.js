// Shared hook for API data fetching with loading/error/retry state
import { useState, useEffect, useCallback } from "react";
import api from "@/api/client";

/**
 * useApiData – fetches data from an API endpoint and manages loading/error state.
 * @param {string} path - API path (e.g. '/courses')
 * @param {any[]} deps - extra dependencies that trigger re-fetch when changed
 * @returns {{ data, loading, error, refetch }}
 */
export function useApiData(path, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: result, error: err } = await api.get(path);
    setLoading(false);
    if (err) { setError(err); return; }
    setData(result);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
