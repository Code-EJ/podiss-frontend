import { useState } from "react";
import { AiOutlineCloudUpload } from 'react-icons/ai';
import api, { errorMessage } from "../../api";
import type { Episode } from "../../types/api";


type VideoUploaderProps = {
    onVideoAdded: (video: Episode) => void;
};

/**
 * Publishes a YouTube URL using the protected episode endpoint; disables duplicate submissions while pending.
 * @author oEnzoRibas
 */
export function VideoUploader({ onVideoAdded }: VideoUploaderProps) {
    const [videoUrl, setVideoUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async () => {
        if (submitting) return;
        // Verifica se o campo não está vazio antes de enviar
        if (!videoUrl.trim()) {
            alert("Por favor, cole um link de vídeo!");
            return;
        }

        setSubmitting(true); setError(null);
        try {
            const response = await api.post<Episode>('/episodes', {
                videoUrl: videoUrl
            });

            alert("Sucesso! O vídeo foi adicionado.");
            onVideoAdded(response.data);
            setVideoUrl(''); // Limpa o campo após sucesso
        } catch (failure) { setError(errorMessage(failure)); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="flex items-center p-6 bg-white">
            <input
                aria-label="Link do YouTube" maxLength={2048} type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Cole o link do YouTube aqui"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <button
                disabled={submitting} onClick={handleUpload}
                className="flex items-center px-4 py-2 ml-2 font-bold text-white transition duration-150 bg-blue-500 rounded shadow-lg hover:bg-blue-600"
            >
                <AiOutlineCloudUpload className="mr-2" />
                Enviar
            </button>
            {error && <p role="alert">{error}</p>}
        </div>
    );
}
