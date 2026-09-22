import { useParams } from 'react-router-dom';
import { apiPaths } from '../../services/api-paths';
import { usePostImageUrl } from '../../hooks/use-post-image-url';
import { useResource } from '../../hooks/use-resource';
import { parseTags } from '../../domain/post';
import { formatDate } from '../../domain/display';
import type { Post } from '../../types/api';
import { PageSection } from '../../components/ui/page-section';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { MediaPreview } from '../../components/ui/media-preview';

/** Public detail rendering is independent from loading/cancellation and preserves editorial line breaks. @author oEnzoRibas */
export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const imageUrl = usePostImageUrl(id ?? '');
  const { data: post, loading, error } = useResource<Post>(id ? apiPaths.post(id) : null);
  return <PageSection>
    {loading ? <Skeleton count={1} /> : error ? <Alert message={error} /> : !post ? <p>Post não encontrado.</p> :
      <Card className="mx-auto max-w-4xl">
        {post.hasImage && <MediaPreview src={imageUrl} alt={post.title} />}
        <article className="space-y-5 p-5 sm:p-8">
          <p className="text-sm text-gray-500">{formatDate(post.createdAt, true)}</p>
          <h1 className="break-words text-3xl font-bold text-gray-800">{post.title}</h1>
          <div className="flex flex-wrap gap-2">{parseTags(post.tags).map(tag => <Badge key={tag}>{tag}</Badge>)}</div>
          <p className="whitespace-pre-wrap break-words leading-relaxed text-gray-700">{post.description}</p>
        </article>
      </Card>}
  </PageSection>;
}
