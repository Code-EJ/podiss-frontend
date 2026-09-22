import { routes } from '../../navigation/routes';
import { isYouTubeId, youtubeThumbnailUrl } from '../../domain/youtube';
import { useNavigate } from 'react-router-dom';

type ContainerVideoProps = {
  id: string;
  videoUrl: string;
  youtubeId: string;
  title: string;
  description: string;
};

/**
 * Links an episode using its provider ID, not its database UUID. Invalid IDs cannot open a player.
 * @author oEnzoRibas
 */
export function ContainerVideo({youtubeId, title}: ContainerVideoProps) {
  const navigate = useNavigate();
  const videoId = isYouTubeId(youtubeId) ? youtubeId : null;

  const handleClick = () => {
    if (videoId) navigate(routes.video(videoId));
  };
  return (
    <button className="w-full space-y-2 hover:bg-zinc-400 p-3 flex flex-col text-left mb-4" disabled={!videoId} onClick={handleClick}>
  <img
    src={videoId ? youtubeThumbnailUrl(videoId) : undefined}
    alt={title}
    className="h-40 w-full object-cover rounded-xl shadow-box-shadow-video"
  />
  <h1 className="text-zinc-950 text-base font-bold overflow-hidden text-ellipsis max-h-11 line-clamp-2">
    {title}
  </h1>
</button>



  );
}
