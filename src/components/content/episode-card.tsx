import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Episode } from '../../types/api';
import { routes } from '../../navigation/routes';
import { isYouTubeId, youtubeThumbnailUrl } from '../../domain/youtube';
import { formatDate } from '../../domain/display';
import { Card } from '../ui/card';
import { MediaPreview } from '../ui/media-preview';

/** Lightweight video summary; embeds load only on the player route, never once per list item. @author oEnzoRibas */
export function EpisodeCard({ episode, actions }: { episode: Episode; actions?: ReactNode }) {
  const valid = isYouTubeId(episode.youtubeId);
  const media = <MediaPreview src={valid ? youtubeThumbnailUrl(episode.youtubeId) : null} alt={episode.title} video={valid} />;
  return <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
    {valid ? <Link to={routes.video(episode.youtubeId)} aria-label={`Assistir ${episode.title}`}>{media}</Link> : media}
    <div className="flex flex-1 flex-col gap-3 p-5">
      <p className="text-xs font-medium text-gray-500">{formatDate(episode.createdAt)}</p>
      <h2 className="line-clamp-3 break-words text-xl font-semibold text-gray-800">{episode.title}</h2>
      <p className="line-clamp-3 break-words text-sm leading-relaxed text-gray-600">{episode.description}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
        {valid ? <Link to={routes.video(episode.youtubeId)} className="rounded text-sm font-semibold text-red-600 hover:underline">Escutá, uai!</Link>
          : <span className="text-sm text-gray-500">Vídeo indisponível</span>}
        {actions}
      </div>
    </div>
  </Card>;
}
