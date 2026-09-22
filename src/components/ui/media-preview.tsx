import { useState } from 'react';
import { FaImage, FaPlay } from 'react-icons/fa';

/** Lazy thumbnail with fixed aspect ratio and a bounded fallback; never retries a broken URL in a loop. @author oEnzoRibas */
export function MediaPreview({ src, alt, video = false }: { src?: string | null; alt: string; video?: boolean }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const available = Boolean(src && failedSource !== src);
  return <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
    {available ? <>
      {loadedSource !== src && <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-amber-50 motion-reduce:animate-none" />}
      <img src={src!} alt={alt} loading="lazy" decoding="async"
        onLoad={() => setLoadedSource(src!)} onError={() => setFailedSource(src!)}
        className="h-full w-full object-cover" />
    </> : <div role="img" aria-label={`${alt} — prévia indisponível`} className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-gray-500">
      <FaImage aria-hidden="true" className="text-3xl" /><span className="text-xs">Prévia indisponível</span>
    </div>}
    {video && <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10">
      <span className="rounded-full bg-black/50 p-4 text-white shadow-lg"><FaPlay /></span>
    </div>}
  </div>;
}
