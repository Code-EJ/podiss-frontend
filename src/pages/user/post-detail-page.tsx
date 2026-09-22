import { apiPaths, postImageUrl } from '../../services/api-paths';
import { parseTags } from '../../domain/post';
import { formatDate } from '../../domain/display';
// src/pages/PostDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import api, { errorMessage } from '../../api';
import type { Post } from '../../types/api';
import { FaTags} from 'react-icons/fa';


/**
 * Loads one public post by UUID and aborts obsolete requests; absent images are not requested.
 * @author oEnzoRibas
 */
const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true); setError(null); setPost(null);
      try {
        const response = await api.get<Post>(apiPaths.post(id), { signal: controller.signal });
        setPost(response.data);
      } catch (err) {
        if (!controller.signal.aborted) setError(errorMessage(err));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchPost();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="flex justify-center items-center h-screen">Post não encontrado.</div>;
  }





  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
      {post.hasImage && <img alt={post.title} className='h-48 w-50 mx-auto ' src={postImageUrl(post.id)}/>}
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-2">{formatDate(post.createdAt, true)}</p>
        <div className="flex items-center mb-4">
          <FaTags className="text-gray-500 mr-2" />
          <div className="flex flex-wrap gap-2">
            {parseTags(post.tags).map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="text-gray-700">{post.description}</p>
      </div>
    </div>
  );
};

export default PostDetailPage;
