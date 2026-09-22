import { apiPaths } from '../../services/api-paths';
import { routes } from '../../navigation/routes';
import { isYouTubeId, youtubeEmbedUrl } from '../../domain/youtube';
import { useState } from 'react';

import { MdDelete, MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../../api';
import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import { Pagination } from '../../components/pagination';
import type { Episode } from '../../types/api';



/**
 * Lists episodes newest first with server pagination; deletion uses the internal UUID.
 * @author oEnzoRibas
 */
const EpisodeListPage = () => {
  const result = usePaginatedResource<Episode>(apiPaths.episodes);
  const { items: episodes, loading, error } = result;
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null);
  const navigate = useNavigate();


  const handleDelete = (episodeId: string) => {
    setActiveEpisodeId(episodeId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (activeEpisodeId && !busy) {
      setBusy(true); setActionError(null);
      try {
        await api.delete(apiPaths.episode(activeEpisodeId));
        result.refresh();
        setIsModalOpen(false);
      } catch (error) {
        setActionError(errorMessage(error));
      } finally { setBusy(false); }
    }
  };

  const handleAddEpisode = () => {
    navigate(routes.createEpisode);
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      {loading && <p role="status">Carregando...</p>}
      {(error || actionError) && <p role="alert" className="text-red-600">{error || actionError}</p>}
      <Pagination {...result} />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Episódios</h1>

      {!loading && !error && episodes.length === 0 ? (
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
            const videoId = episode.youtubeId;

            return (
              <div
                key={episode.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
              >
                {isYouTubeId(videoId) ? (
                  <iframe
                    width="100%"
                    height="200"
                    src={youtubeEmbedUrl(videoId)}
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
                    aria-label="Excluir episódio" onClick={() => handleDelete(episode.id)}
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
        <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center">
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
                disabled={busy} onClick={confirmDelete}
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
