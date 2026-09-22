import { Alert } from './alert';
import { Skeleton } from './skeleton';

/** Keeps read failures distinct from an empty collection, with placeholders only on the initial read. @author oEnzoRibas */
export function CollectionState({ loading, error, count, empty }: { loading: boolean; error: string | null; count: number; empty: string }) {
  return <>
    {loading && count === 0 && <Skeleton />}
    {loading && count > 0 && <p role="status" className="text-sm text-amber-800">Atualizando conteúdo...</p>}
    <Alert message={error} />
    {!loading && !error && count === 0 && <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">{empty}</p>}
  </>;
}
