import { useState } from "react";
import { AiOutlineCloudUpload } from 'react-icons/ai';
import api from "../../api";
import { API_URL } from "../../database";

type Episode = {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    createdAt: string;
};

type VideoUploaderProps = {
    onVideoAdded: (video: Episode) => void;
};

export function VideoUploader({ onVideoAdded }: VideoUploaderProps) {
    const [videoUrl, setVideoUrl] = useState('');

    const handleUpload = async () => {
        // Verifica se o campo não está vazio antes de enviar
        if (!videoUrl.trim()) {
            alert("Por favor, cole um link de vídeo!");
            return;
        }

        try {
            const response = await api.post(`${API_URL}/episodes`, {
                videoUrl: videoUrl
            });
            
            alert("Sucesso! O vídeo foi adicionado.");
            onVideoAdded(response.data);
            setVideoUrl(''); // Limpa o campo após sucesso
        } catch (error: any) {
            console.error("Erro completo:", error);
            // Isso mostrará na tela exatamente por que o servidor rejeitou
            const msg = error.response?.status === 403 
                ? "Erro: Você não tem permissão (Login expirado?)." 
                : "Erro ao enviar: " + (error.response?.data?.message || error.message);
            alert(msg);
        }
    };

    return (
        <div className="flex items-center p-6 bg-white">
            <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Cole o link do YouTube aqui"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <button 
                onClick={handleUpload} 
                className="flex items-center px-4 py-2 ml-2 font-bold text-white transition duration-150 bg-blue-500 rounded shadow-lg hover:bg-blue-600"
            >
                <AiOutlineCloudUpload className="mr-2" />
                Enviar
            </button>
        </div>
    );
}