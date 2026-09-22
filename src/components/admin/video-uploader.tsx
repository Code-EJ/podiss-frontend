import { useState } from 'react';
import { contentService } from '../../services/content-service';
import { useAsyncAction } from '../../hooks/use-async-action';
import type { Episode } from '../../types/api';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';

/** Sends a validated form; endpoint construction and async feedback live outside presentation. @author oEnzoRibas */
export function VideoUploader({ onVideoAdded }: { onVideoAdded: (video: Episode) => void }) {
  const [videoUrl, setVideoUrl] = useState('');
  const { busy, error, run } = useAsyncAction();
  return <form className="space-y-4 rounded-xl border border-gray-200 bg-white p-5" onSubmit={async event => {
    event.preventDefault();
    const result = await run(() => contentService.createEpisode(videoUrl.trim()), {
      loading: 'Publicando episódio...', success: 'Episódio publicado com sucesso!',
    });
    if (result.ok) { setVideoUrl(''); onVideoAdded(result.value.data); }
  }}>
    <label htmlFor="youtube-url" className="block font-medium">Link do YouTube</label>
    <input id="youtube-url" required maxLength={2048} type="url" value={videoUrl} disabled={busy}
      onChange={event => setVideoUrl(event.target.value)} placeholder="Cole o link do YouTube aqui"
      className="w-full rounded-lg border border-gray-300 p-3" />
    <Alert message={error} />
    <Button type="submit" loading={busy} loadingText="Publicando...">Enviar</Button>
  </form>;
}
