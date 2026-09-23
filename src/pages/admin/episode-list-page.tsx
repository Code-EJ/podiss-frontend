import { useState } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../navigation/routes';
import { apiPaths } from '../../services/api-paths';
import { contentService } from '../../services/content-service';
import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import { useAsyncAction } from '../../hooks/use-async-action';
import type { Episode } from '../../types/api';
import { Pagination } from '../../components/pagination';
import { EpisodeCard } from '../../components/content/episode-card';
import { AnimatedGrid } from '../../components/ui/animated-grid';
import { PageSection } from '../../components/ui/page-section';
import { CollectionState } from '../../components/ui/collection-state';
import { Button } from '../../components/ui/button';
import { Modal } from '../../components/ui/modal';
import { Alert } from '../../components/ui/alert';

/** Uses lightweight video cards and deletes only after explicit confirmation. @author oEnzoRibas */
export default function EpisodeListPage() {
  const result = usePaginatedResource<Episode>(apiPaths.episodes);
  const action = useAsyncAction();
  const [selected, setSelected] = useState<Episode | null>(null);
  return <PageSection title="Episódios">
    <Link className="inline-flex min-h-11 items-center rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600" to={routes.createEpisode}>Adicionar Vídeo</Link>
    <CollectionState {...result} count={result.items.length} empty="Não possui vídeos, adicione um!" />
    <Pagination {...result} />
    <AnimatedGrid items={result.items}>{episode => <EpisodeCard episode={episode} actions={
      <Button variant="danger" aria-label="Excluir episódio" onClick={() => setSelected(episode)}>Excluir</Button>
    } />}</AnimatedGrid>
    <Modal open={Boolean(selected)} title="Confirmar Exclusão" busy={action.busy} onClose={() => setSelected(null)}>
      <p>Tem certeza de que deseja excluir este episódio?</p>
      <Alert message={action.error} />
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" disabled={action.busy} onClick={() => setSelected(null)}>Cancelar</Button>
        <Button variant="danger" loading={action.busy} loadingText="Excluindo..." onClick={async () => {
          if (!selected) return;
          const response = await action.run(() => contentService.deleteEpisode(selected.id), { loading: 'Excluindo episódio...', success: 'Episódio excluído.' });
          if (response.ok) { setSelected(null); result.refresh(); }
        }}>Excluir</Button>
      </div>
    </Modal>
  </PageSection>;
}
