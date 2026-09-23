import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../../types/api';
import { usePostImageUrl } from '../../hooks/use-post-image-url';
import { routes } from '../../navigation/routes';
import { formatDate } from '../../domain/display';
import { parseTags } from '../../domain/post';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { MediaPreview } from '../ui/media-preview';

/** Presentational post summary; only real backend metadata and explicit caller-provided actions. @author oEnzoRibas */
export function PostCard({ post, actions }: { post: Post; actions?: ReactNode }) {
  const imageUrl = usePostImageUrl(post.id);
  return <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
    <Link to={routes.post(post.id)} aria-label={`Ler ${post.title}`}>
      <MediaPreview src={post.hasImage ? imageUrl : null} alt={post.title} />
    </Link>
    <div className="flex flex-1 flex-col gap-3 p-5">
      <p className="text-xs font-medium text-gray-500">{formatDate(post.createdAt)}</p>
      <h2 className="break-words text-xl font-semibold text-gray-800"><Link to={routes.post(post.id)}>{post.title}</Link></h2>
      <p className="line-clamp-3 break-words text-sm leading-relaxed text-gray-600">{post.description}</p>
      <div className="flex flex-wrap gap-2">{parseTags(post.tags).map(tag => <Badge key={tag}>{tag}</Badge>)}</div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
        <Link to={routes.post(post.id)} className="rounded text-sm font-semibold text-red-600 hover:underline">SAIBA MAIS &gt;&gt;</Link>
        {actions}
      </div>
    </div>
  </Card>;
}
