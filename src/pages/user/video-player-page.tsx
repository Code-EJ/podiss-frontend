import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GetUrl from '../../database';

type VideoPlayerPageParams = {
  id: string;
  videoId: string;
};

type VideoData = {
  title: string;
  description: string;
  videoUrl: string;
};

export function VideoPlayerPage() {
  const { id } = useParams<VideoPlayerPageParams>();
  const [videoData, setVideoData] = useState<VideoData>({
    title: '',
    description: '',
    videoUrl: '',
  });

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`${GetUrl()}/video/${id}`);
        const data = await response.json();
        setVideoData({
          title: data.title,
          description: data.description,
          videoUrl: data.videoUrl,
        });
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };
  
    fetchVideoData();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center py-5">
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
        <h2 className="text-zinc-950 text-2xl font-bold mb-2">{videoData.title}</h2>
        <p className="text-zinc-700 text-lg">{videoData.description}</p>
      </div>
    </div>
  );
}
