import { apiPaths } from '../../services/api-paths';
import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import type { Episode } from '../../types/api';
import { EpisodeCard } from '../../components/content/episode-card';
import { PageSection } from '../../components/ui/page-section';
import { AnimatedGrid } from '../../components/ui/animated-grid';
import { CollectionState } from '../../components/ui/collection-state';
import { Pagination } from '../../components/pagination';

/** Paginated episode collection with one lightweight preview per resource. @author oEnzoRibas */
export default function UserEpisodes() {
  const result = usePaginatedResource<Episode>(apiPaths.episodes);
  return <PageSection title="Dá uma espiada nos episódios:">
    <CollectionState {...result} count={result.items.length} empty="Nenhum episódio encontrado." />
    <Pagination {...result} />
    <AnimatedGrid items={result.items}>{episode => <EpisodeCard episode={episode} />}</AnimatedGrid>
  </PageSection>;
}
