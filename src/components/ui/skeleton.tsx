/** Geometry-preserving loading placeholders; motion reduction disables the pulse. @author oEnzoRibas */
export function Skeleton({ count = 3 }: { count?: number }) {
  return <div role="status" aria-label="Carregando conteúdo" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
    <span className="sr-only">Carregando...</span>
    {Array.from({ length: count }, (_, index) => <div key={index} aria-hidden="true" className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="aspect-video animate-pulse bg-amber-50 motion-reduce:animate-none" />
      <div className="space-y-3 p-5"><div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 motion-reduce:animate-none" />
        <div className="h-4 w-full rounded bg-gray-100" /><div className="h-4 w-1/2 rounded bg-gray-100" /></div>
    </div>)}
  </div>;
}
