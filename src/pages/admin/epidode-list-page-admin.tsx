import { useEffect, useState } from 'react';

import { MdDelete, MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

interface Episode {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  createdAt: string;
}

const extractVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);

    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = '';

      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || '';
        if (!videoId && urlObj.pathname.includes('/embed/')) {
          videoId = urlObj.pathname.split('/embed/')[1];
        }
      }
      videoId = videoId.split(/[&?#]/)[0];
      if (videoId && videoId.length === 11) {
        return videoId;
      } else {
        const paths = urlObj.pathname.split('/');
        for (const path of paths) {
          if (path.length === 11) {
            return path;
          }
        }
      }
    }
    return null;
  } catch (error) {
    // Retornando null caso invalido
    return null;
  }
};

const EpisodeListPage = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await api.get('/episodes');
        setEpisodes(response.data.reverse());
      } catch (error) {
        console.error('Erro ao buscar episódios:', error);
      }
    };
    fetchEpisodes();
  }, []);

  const handleDelete = (episodeId: string) => {
    setActiveEpisodeId(episodeId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (activeEpisodeId) {
      try {
        await api.delete(`/episodes/${activeEpisodeId}`);
        setEpisodes((prev) => prev.filter((episode) => episode.id !== activeEpisodeId));
        setIsModalOpen(false);
      } catch (error) {
        console.error('Erro ao deletar episódio:', error);
      }
    }
  };

  const handleAddEpisode = () => {
    navigate('/admin/create-episode');
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Episódios</h1>

      {episodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl text-gray-600 mb-4">Não possui vídeos, adicione um!</h2>
          <button
            onClick={handleAddEpisode}
            className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <MdAdd className="mr-2" size={24} />
            Adicionar Vídeo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {episodes.map((episode) => {
            const videoId = extractVideoId(episode.videoUrl);

            return (
              <div
                key={episode.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
              >
                {videoId ? (
                  <iframe
                    width="100%"
                    height="200"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={episode.title}
                    className="rounded-t-lg"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">URL do vídeo inválida</p>
                  </div>
                )}
                <div className="p-4 flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800">{episode.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-2">{episode.description}</p>
                </div>
                <div className="p-2 flex justify-end">
                  <button
                    onClick={() => handleDelete(episode.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full transition-colors"
                  >
                    <MdDelete size="24" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg z-10">
            <h2 className="font-bold text-lg mb-4">Confirmar Exclusão</h2>
            <p>Tem certeza de que deseja excluir este episódio?</p>
            <div className="flex justify-around mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeListPage;
