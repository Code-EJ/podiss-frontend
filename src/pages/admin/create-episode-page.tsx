
import { useNavigate } from 'react-router-dom';
import { VideoUploader } from '../../components/admin/video-uploader';

/**
 * Navigates to the episode list after the server successfully publishes a video.
 * @author oEnzoRibas
 */
const CreateEpisodePage = () => {
  const navigate = useNavigate();
  const handleVideoAdded = () => navigate('/admin/episodes-admin');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Criar Episódio</h1>
      <VideoUploader onVideoAdded={handleVideoAdded} />
    </div>
  );
};

export default CreateEpisodePage;
