import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api';
/**
 * Reads the backend array/header pagination contract, sorted newest first.
 * Cancels obsolete requests and moves back when deletion empties the last page.
 * @param path - Relative API collection path; never an arbitrary external URL.
 * @param size - Records per page, within the backend's 1–100 limit.
 * @returns Items, status, navigation and an explicit refresh operation.
 * @author oEnzoRibas
 */
export function usePaginatedResource<T>(path: string, size = 20) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError(null);
    api.get<T[]>(path, { params: { page, size, order: 'desc' }, signal: controller.signal })
      .then(response => {
        if (controller.signal.aborted) return;
        if (!Array.isArray(response.data)) throw new Error('Resposta inesperada da API.');
        const raw = response.headers['x-total-pages']; const count = Number(raw);
        if (raw == null || !Number.isInteger(count) || count < 0)
          throw new Error('Paginação indisponível. Confira os headers CORS da API.');
        if (page > 0 && page >= count) { setPage(Math.max(0, count - 1)); return; }
        setItems(response.data); setTotalPages(count);
      })
      .catch((failure: unknown) => { if (!controller.signal.aborted) { setItems([]); setError(errorMessage(failure)); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [path, page, size, revision]);
  return { items, page, totalPages, setPage, loading, error, refresh: () => setRevision(value => value + 1) };
}
