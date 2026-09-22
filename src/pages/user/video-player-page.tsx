import { useParams } from 'react-router-dom';
import { apiPaths } from '../../services/api-paths';
import { useResource } from '../../hooks/use-resource';
import { isYouTubeId, youtubeEmbedUrl } from '../../domain/youtube';
import type { Episode } from '../../types/api';
import { PageSection } from '../../components/ui/page-section';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert } from '../../components/ui/alert';

/** Only the detail route mounts a lazy, ratio-correct player after successful metadata validation. @author oEnzoRibas */
export function VideoPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const valid = Boolean(id && isYouTubeId(id));
  const { data, loading, error } = useResource<Episode>(valid ? apiPaths.episode(id!) : null);
  return <PageSection>
    {!valid ? <Alert message="Episódio inválido." /> : loading ? <Skeleton count={1} /> : error ? <Alert message={error} /> : data && <>
      <h1 className="break-words text-3xl font-bold text-zinc-800">{data.title}</h1>
      <div className="mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-xl bg-gray-100">
        <iframe loading="lazy" className="h-full w-full" src={youtubeEmbedUrl(id!)} title={data.title || 'YouTube video player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
      <p className="whitespace-pre-wrap break-words text-lg leading-relaxed text-zinc-700">{data.description}</p>
      <p className="text-sm text-gray-500">Se o vídeo estiver indisponível, tente novamente mais tarde.</p>
    </>}
  </PageSection>;
}
