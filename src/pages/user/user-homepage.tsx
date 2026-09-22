import { apiPaths } from '../../services/api-paths';
// pages/user/user-homepage.tsx
import React from 'react';
import { ContainerVideo } from '../../components/user/container-video';
import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import { Pagination } from '../../components/pagination';
import type { Episode } from '../../types/api';


/**
 * Lists public episodes using descending server-side pagination, rather than reversing a truncated local page.
 * @author oEnzoRibas
 */
const UserEpisodes: React.FC = () => {
  const result = usePaginatedResource<Episode>(apiPaths.episodes, 20);
  const { items: videos, loading: isLoading, error } = result;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="space-y-7">
        <h1 className="text-4xl font-bold text-zinc-800">Dá uma espiada nos episódios:</h1>
        {isLoading && <p className="text-gray-500">Carregando vídeos...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <Pagination {...result} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {!isLoading && !error && videos.length === 0 && <p>Nenhum episódio encontrado.</p>}
              {videos.map(video => (
            <ContainerVideo key={video.id} {...video} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserEpisodes;
