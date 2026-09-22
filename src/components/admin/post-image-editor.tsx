import { apiPaths } from '../../services/api-paths';
import { useRef, useState } from 'react';
import api, { errorMessage } from '../../api';
import { postForm } from '../../domain/post';

/**
 * Replaces or removes only a post image using the dedicated backend routes.
 * The parent refreshes its summary after success; text fields are not submitted.
 * @author oEnzoRibas
 */
export function PostImageEditor({ postId, onChanged }: { postId: string; onChanged: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const change = async (remove: boolean) => {
    if (busy) return;
    setBusy(true); setError(null);
    try {
      if (remove) await api.delete(apiPaths.postImage(postId));
      else {
        const image = input.current?.files?.[0];
        if (!image) throw new Error('Selecione uma imagem.');
        const validated = postForm('', '', [], image);
        validated.delete('title'); validated.delete('description');
        await api.put(apiPaths.postImage(postId), validated);
      }
      if (input.current) input.current.value = '';
      onChanged();
    } catch (failure) { setError(errorMessage(failure)); }
    finally { setBusy(false); }
  };
  return <fieldset className="border p-3 my-3" disabled={busy}>
    <legend>Imagem do post</legend>
    <input ref={input} type="file" aria-label="Nova imagem do post" accept="image/jpeg,image/png,image/gif,image/webp" />
    <button type="button" className="border rounded p-2 m-1" onClick={() => change(false)}>Substituir imagem</button>
    <button type="button" className="border rounded p-2 m-1" onClick={() => change(true)}>Remover imagem</button>
    {error && <p role="alert" className="text-red-600">{error}</p>}
  </fieldset>;
}
