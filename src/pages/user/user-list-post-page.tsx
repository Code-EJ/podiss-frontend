import { apiPaths } from '../../services/api-paths';
import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import type { Post } from '../../types/api';
import { PostCard } from '../../components/content/post-card';
import { PageSection } from '../../components/ui/page-section';
import { AnimatedGrid } from '../../components/ui/animated-grid';
import { CollectionState } from '../../components/ui/collection-state';
import { Pagination } from '../../components/pagination';

/** Public post grid shares the same metadata and media presentation as the panel. @author oEnzoRibas */
export default function PostListPage() {
  const result = usePaginatedResource<Post>(apiPaths.posts);
  return <PageSection title="Óia só esses posts:" description="Página dedicada aos posts do site.">
    <CollectionState {...result} count={result.items.length} empty="Nenhum post encontrado." />
    <Pagination {...result} />
    <AnimatedGrid items={result.items}>{post => <PostCard post={post} />}</AnimatedGrid>
  </PageSection>;
}
