import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { errorMessage } from '../../api';
import UserNavbar from '../../components/user/user-navbar';

type VideoPlayerPageParams = {
  id: string;
  videoId: string;
};

type VideoData = {
  title: string;
  description: string;
  videoUrl: string;
};

/**
 * Loads public episode metadata by YouTube ID and embeds only after a successful response.
 * @author oEnzoRibas
 */
export function VideoPlayerPage() {
  const { id } = useParams<VideoPlayerPageParams>();
  const [videoData, setVideoData] = useState<VideoData>({
    title: '',
    description: '',
    videoUrl: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(null);
    const fetchVideoData = async () => {
      try {
        if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) throw new Error('Episódio inválido.');
        const response = await api.get<VideoData>(`/episodes/${id}`, { signal: controller.signal });
        const data = response.data;
        setVideoData({
          title: data.title,
          description: data.description,
          videoUrl: data.videoUrl,
        });
      } catch (error) {
        if (!controller.signal.aborted) setError(errorMessage(error));
      } finally { if (!controller.signal.aborted) setLoading(false); }
    };

    fetchVideoData();
    return () => controller.abort();
  }, [id]);

  if (loading) return <p role="status">Carregando...</p>;
  if (error) return <p role="alert">{error}</p>;
  return (

    <div className="flex flex-col items-center justify-center py-5">
      <UserNavbar/>
      <h2 className="text-zinc-950 text-2xl font-bold mb-2 pt-28">{videoData.title}</h2>
      <div className="w-full max-w-4xl p-5 rounded-lg">
        <iframe
          className="w-full h-96 mb-4"
          width="70%"
          height="500px"
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen>
        </iframe>

        <p className="text-zinc-700 text-lg">{videoData.description}</p>
      </div>
    </div>
  );
}
