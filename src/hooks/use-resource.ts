import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api';

/** Cancellable detail reads keep stale responses from replacing the active route's content. @author oEnzoRibas */
export function useResource<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setData(null); setError(null); setLoading(Boolean(path));
    if (!path) return;
    const controller = new AbortController();
    api.get<T>(path, { signal: controller.signal })
      .then(response => { if (!controller.signal.aborted) setData(response.data); })
      .catch(failure => { if (!controller.signal.aborted) setError(errorMessage(failure)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [path]);
  return { data, loading, error };
}
