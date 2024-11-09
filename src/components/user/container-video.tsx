import { useNavigate } from 'react-router-dom';

type ContainerVideoProps = {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
};

const extractVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = '';

      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || '';
      }
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

    // Caso não consiga extrair o ID, retorna null
    return null;
  } catch (error) {
    // Caso a URL seja inválida, retorna null
    return null;
  }
};

export function ContainerVideo({videoUrl, title}: ContainerVideoProps) {
  const navigate = useNavigate();
  const videoId = extractVideoId(videoUrl);

  const handleClick = () => {
    navigate(`/video/${videoId}`);
  };
 // Depois preciso olhar se está certinho o retorno do vídeo
  return (
    <button className="w-full space-y-2 hover:bg-zinc-400 p-3 flex flex-col text-left mb-4" onClick={handleClick}>
  <img 
    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
    alt={title} 
    className="h-40 w-full object-cover rounded-xl shadow-box-shadow-video" 
  />
  <h1 className="text-zinc-950 text-base font-bold overflow-hidden text-ellipsis max-h-11 line-clamp-2">
    {title}
  </h1>
</button>



  );
} 
