import { useState, useEffect } from "react";
import ApiFetcher, { ApiResponse } from "../System/Lib/ApiFetcher";

export function useFetch(endpoint: string) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const apiFetcher = new ApiFetcher("https://api.github.com");
    apiFetcher.get(endpoint)
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { data, loading, error };
}