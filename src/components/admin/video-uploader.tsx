
import { useState } from "react";
import { AiOutlineCloudUpload } from 'react-icons/ai'; // Importando ícone de upload
import api from "../../api";
import GetUrl from "../../database";


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
        try {
            const response = await api.post(`${GetUrl()}/episodes`, {
                videoUrl: videoUrl
            });
            const newEpisode = response.data;
            onVideoAdded(newEpisode);
            setVideoUrl('');
        } catch (error) {
            console.error("There was an error uploading the video!", error);
        }
    };

    return (
        <div className="flex  justify-content items-center bg-white p-6">
            <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Cole o link aqui"
                className="p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <button onClick={handleUpload} className="ml-2 flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow transition duration-150 ease-in-out">
                <AiOutlineCloudUpload className="mr-2" />
                Enviar Vídeo
            </button>
        </div>
    );
}
