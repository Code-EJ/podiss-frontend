import { useEffect, useState } from 'react';
import type { Post } from '../../types/api';
import { savePost } from '../../services/content-service';
import { parseTags } from '../../domain/post';
import { useAsyncAction } from '../../hooks/use-async-action';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';
import { PostImageEditor } from './post-image-editor';

/** Saves selected text and image together in the UI while coordinating separate backend operations. @author oEnzoRibas */
export function PostEditor({ post, open, onClose, onSaved, onImageChanged }: {
  post: Post | null; open: boolean; onClose: () => void; onSaved: () => void; onImageChanged: () => void;
}) {
  const [locked, setLocked] = useState(false);
  return <Modal open={open && Boolean(post)} title="Editar Post" busy={locked} onClose={onClose}>
    {post && <PostEditorForm key={post.id} post={post} onSaved={onSaved} onImageChanged={onImageChanged} onBusyChange={setLocked} />}
  </Modal>;
}
function PostEditorForm({ post, onSaved, onImageChanged, onBusyChange }: {
  post: Post; onSaved: () => void; onImageChanged: () => void; onBusyChange: (busy: boolean) => void;
}) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [tags, setTags] = useState(post.tags);
  const [imageBusy, setImageBusy] = useState(false);
  const [pendingImage, setPendingImage] = useState<File>();
  const { busy, error, run } = useAsyncAction();
  useEffect(() => { onBusyChange(busy || imageBusy); }, [busy, imageBusy, onBusyChange]);
  return <div className="space-y-4">
    <form id="edit-post" onSubmit={async event => {
      event.preventDefault(); if (imageBusy) return;
      const result = await run(() => savePost(post.id, { title, description, tags: parseTags(tags) }, pendingImage), {
        loading: 'Atualizando post...', success: 'Post atualizado com sucesso!',
      });
      if (result.ok) onSaved();
    }}>
      <fieldset disabled={busy || imageBusy} className="min-w-0 space-y-4">
        <label className="block font-medium" htmlFor="edit-title">Título:</label>
        <input id="edit-title" required maxLength={255} value={title} onChange={event => setTitle(event.target.value)} className="w-full rounded-lg border p-3" />
        <label className="block font-medium" htmlFor="edit-description">Descrição:</label>
        <textarea id="edit-description" required maxLength={10000} rows={5} value={description} onChange={event => setDescription(event.target.value)} className="w-full rounded-lg border p-3" />
        <label className="block font-medium" htmlFor="edit-tags">Tags:</label>
        <input id="edit-tags" value={tags} onChange={event => setTags(event.target.value)} className="w-full rounded-lg border p-3" />
      </fieldset>
      <Alert message={error} />
    </form>
    <PostImageEditor postId={post.id} disabled={busy} onChanged={onImageChanged} onBusyChange={setImageBusy} onPendingImageChange={setPendingImage} />
    <Button form="edit-post" type="submit" loading={busy} disabled={imageBusy} loadingText="Atualizando...">Atualizar</Button>
  </div>;
}
