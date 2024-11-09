
import { VideoUploader } from '../../components/admin/video-uploader';

const CreateEpisodePage = () => {
  const handleVideoAdded = (video: any) => {
    console.log('Episódio adicionado:', video);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Criar Episódio</h1>
      <VideoUploader onVideoAdded={handleVideoAdded} />
    </div>
  );
};

export default CreateEpisodePage;