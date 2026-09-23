import { useState } from 'react';
import { apiPaths } from '../../services/api-paths';
import { contentService } from '../../services/content-service';
import { siteContent } from '../../content/site-content';
import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import { useAsyncAction } from '../../hooks/use-async-action';
import type { Post } from '../../types/api';
import { Pagination } from '../../components/pagination';
import { PostCard } from '../../components/content/post-card';
import { AnimatedGrid } from '../../components/ui/animated-grid';
import { PageSection } from '../../components/ui/page-section';
import { CollectionState } from '../../components/ui/collection-state';
import { Button } from '../../components/ui/button';
import { Modal } from '../../components/ui/modal';
import { Alert } from '../../components/ui/alert';
import { PostEditor } from '../../components/admin/post-editor';

/** Orchestrates server-backed post actions; cards, confirmation and editing are independent UI modules. @author oEnzoRibas */
export default function ListPostPage() {
  const result = usePaginatedResource<Post>(apiPaths.posts);
  const deletion = useAsyncAction();
  const [deleting, setDeleting] = useState<Post | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  return <PageSection title={siteContent.adminHeading} description="Postagens Recentes:">
    <CollectionState {...result} count={result.items.length} empty="Nenhum post encontrado." />
    <Pagination {...result} />
    <AnimatedGrid items={result.items}>{post => <PostCard post={post} actions={<div className="flex flex-wrap gap-2">
      <Button variant="secondary" aria-label="Editar post" onClick={() => { setEditing(post); setEditOpen(true); }}>Editar</Button>
      <Button variant="danger" aria-label="Excluir post" onClick={() => setDeleting(post)}>Excluir</Button>
    </div>} />}</AnimatedGrid>
    <Modal open={Boolean(deleting)} title="Confirmar Exclusão" busy={deletion.busy} onClose={() => setDeleting(null)}>
      <p className="text-gray-600">Tem certeza de que deseja excluir este post?</p>
      <Alert message={deletion.error} />
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" disabled={deletion.busy} onClick={() => setDeleting(null)}>Cancelar</Button>
        <Button variant="danger" loading={deletion.busy} loadingText="Excluindo..." onClick={async () => {
          if (!deleting) return;
          const response = await deletion.run(() => contentService.deletePost(deleting.id), {
            loading: 'Excluindo post...', success: 'Post excluído com sucesso!',
          });
          if (response.ok) { setDeleting(null); result.refresh(); }
        }}>Excluir</Button>
      </div>
    </Modal>
    <PostEditor post={editing} open={editOpen} onClose={() => setEditOpen(false)}
      onImageChanged={result.refresh} onSaved={() => { setEditOpen(false); result.refresh(); }} />
  </PageSection>;
}
