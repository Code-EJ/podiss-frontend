// pages/user/user-homepage.tsx
import React, { useEffect, useState } from 'react';
import { ContainerVideo } from '../../components/user/container-video';
import { API_URL } from '../../database';

interface Video {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
}

const UserEpisodes: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${ API_URL }/episodes`);
        if (!response.ok) {
          throw new Error('Falha ao buscar vídeos.');
        }
        const data = await response.json();
        setVideos(data.reverse());
      } catch (err) {
        console.error('Erro ao buscar vídeos:', err);
        setError('Não foi possível carregar os vídeos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="space-y-7">
        <h1 className="text-4xl font-bold text-zinc-800">Dá uma espiada nos episódios:</h1>
        {isLoading && <p className="text-gray-500">Carregando vídeos...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {videos.map(video => (
            <ContainerVideo key={video.id} {...video} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserEpisodes;
