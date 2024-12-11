// src/pages/user/UserInitialPetry.tsx
import React, { useState, useEffect } from 'react';
import GetUrl from '../../database';
import UserNavbar from '../../components/user/user-navbar';
import { ContainerVideo } from '../../components/user/container-video';


interface Video {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  createdAt: string; // Campo de data
}

const UserInitialPetry: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${GetUrl()}/episodes`);
        if (!response.ok) {
          throw new Error('Falha ao buscar vídeos.');
        }
        const data: Video[] = await response.json();
        const sortedVideos = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const recentVideos = sortedVideos.slice(0, 3);
        setVideos(recentVideos);
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
    <div className="min-h-screen flex flex-col">
      <UserNavbar />
      
      <main className="flex-grow pt-28"> {/* Adiciona padding-top para não ficar atrás da navbar fixa */}
        {/* Seção de Boas-Vindas */}
        <section className="welcome-section bg-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-800">Ô trem bão! Bem Vindo ao Podcast</h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              Estamos contribuindo para trazer entretenimento e informações para todos.
            </p>
          </div>
        </section>

        {/* Seção de Destaques */}
        <section className="highlights-container py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-center text-zinc-800 mb-8">Destaques</h2>
            {isLoading && <p className="text-center text-gray-500">Carregando vídeos...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {videos.map(video => (
                <ContainerVideo key={video.id} {...video} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <p>
            Ô gente, entra em contato com a gente por email: <a href="mailto:contato@podcast.com" className="underline">contato@podcast.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserInitialPetry;
