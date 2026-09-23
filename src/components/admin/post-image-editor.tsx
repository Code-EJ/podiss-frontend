import { useEffect, useRef } from 'react';
import { contentService } from '../../services/content-service';
import { useAsyncAction } from '../../hooks/use-async-action';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';

/** Mutates only image data; parent locks competing text updates while this operation runs. @author oEnzoRibas */
export function PostImageEditor({ postId, onChanged, disabled, onBusyChange, onPendingImageChange }: {
  postId: string; onChanged: () => void; disabled?: boolean; onBusyChange?: (busy: boolean) => void;
  onPendingImageChange?: (image: File | undefined) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const { busy, error, run } = useAsyncAction();
  useEffect(() => { onBusyChange?.(busy); }, [busy, onBusyChange]);
  const change = async (remove: boolean) => {
    if (disabled) return;
    const result = await run(async () => {
      if (remove) return contentService.removeImage(postId);
      const image = input.current?.files?.[0];
      if (!image) throw new Error('Selecione uma imagem.');
      return contentService.replaceImage(postId, image);
    }, { loading: remove ? 'Removendo imagem...' : 'Enviando imagem...', success: remove ? 'Imagem removida.' : 'Imagem atualizada.' });
    if (result.ok) { if (input.current) input.current.value = ''; onPendingImageChange?.(undefined); onChanged(); }
  };
  return <fieldset className="my-4 min-w-0 space-y-3 rounded-lg border border-gray-200 p-4" disabled={busy || disabled}>
    <legend className="px-1 font-medium">Imagem do post</legend>
    <input ref={input} type="file" onChange={event => onPendingImageChange?.(event.target.files?.[0])} className="w-full min-w-0 text-sm" aria-label="Nova imagem do post" accept="image/jpeg,image/png,image/gif,image/webp" />
    {onPendingImageChange && <p className="text-sm text-gray-600">A imagem selecionada será enviada ao clicar Atualizar. Para enviar somente a imagem, use Substituir imagem.</p>}
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" loading={busy} disabled={disabled} onClick={() => change(false)}>Substituir imagem</Button>
      <Button variant="danger" disabled={busy || disabled} onClick={() => change(true)}>Remover imagem</Button>
    </div>
    <Alert message={error} />
  </fieldset>;
}
