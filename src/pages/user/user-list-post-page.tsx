
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GetUrl from '../../database';

interface Post {
  id: string;
  title: string;
  description: string;
  tags: string;
  createdAt: string;
}

const PostListPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Post[]>(`${GetUrl()}/posts/`);
        setPosts(response.data.reverse());
      } catch (err) {
        setError('Erro ao carregar os posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-zinc-700 mb-8">Óia só esses posts:</h1>
      <p className="mb-12 text-gray-600 max-w-2xl">
        Página dedicada aos posts do site.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{new Date(post.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-700 mb-4">{post.description}</p>
            <div className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Categorias: </span>
              {post.tags.split(',').map((tag) => (
                <span key={tag} className="inline-block bg-purple-200 text-purple-800 px-2 py-1 rounded-full mr-2">
                  {tag.trim()}
                </span>
              ))}
            </div>
            <a href={`/posts/${post.id}`} className="text-red-600 font-semibold text-center">SAIBA MAIS {">>"}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostListPage;
