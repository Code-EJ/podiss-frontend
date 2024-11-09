// src/pages/PostDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaTags, FaArrowLeft } from 'react-icons/fa';

interface Post {
  id: string;
  title: string;
  description: string;
  tags: string;
  createdAt: string;
}

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await axios.get<Post>(`http://localhost:8080/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('Erro ao carregar o post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
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


  const getTags = (tags: string) => {
    return tags.split(',').map((tag) => tag.trim());
  };


  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-4">
      <Link to="/posts" className="text-blue-500 flex items-center mb-4">
        <FaArrowLeft className="mr-2" /> Voltar para Posts
      </Link>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-2">{formatDate(post.createdAt)}</p>
        <div className="flex items-center mb-4">
          <FaTags className="text-gray-500 mr-2" />
          <div className="flex flex-wrap gap-2">
            {getTags(post.tags).map((tag, index) => (
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
