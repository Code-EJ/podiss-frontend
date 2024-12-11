// src/pages/admin/ListPostPage.tsx
import React, { useEffect, useState, useContext } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import api from '../../api';
import { AuthContext } from '../../auth-context';
import axios from 'axios';
import GetUrl from '../../database';


interface Post {
  id: string;
  title: string;
  description: string;
  tags: string;
  createdAt?: string;
}

const ListPostPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [editedPost, setEditedPost] = useState<Post | null>(null);

  useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${GetUrl()}/posts`);
        setPosts(response.data.reverse());
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = (postId: string) => {
    setActivePostId(postId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (activePostId) {
      try {
        await api.delete(`/posts/${activePostId}`);
        setPosts((posts) => posts.filter((post) => post.id !== activePostId));
        setIsModalOpen(false);
      } catch (error) {
        console.error('Erro ao deletar post:', error);
      }
    }
  };

  const handleEdit = (post: Post) => {
    setEditedPost(post);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (editedPost) {
      try {
        await api.put(`/posts/${editedPost.id}`, {
          title: editedPost.title,
          description: editedPost.description,
          tags: editedPost.tags.split(',').map((tag) => tag.trim()),
        });
        setPosts(posts.map((post) => (post.id === editedPost.id ? editedPost : post)));
        setIsEditModalOpen(false);
      } catch (error) {
        console.error('Erro ao atualizar post:', error);
      }
    }
  };

  return (
    <div className="p-2">
      <div className="bg-white rounded-lg p-6 shadow-md text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Seja bem-vinda, Yolanda!</h1>
        <p className="text-gray-500">Postagens Recentes:</p>
      </div>
      <div className="bg-white p-6 overflow-y-auto max-h-[calc(100vh-150px)]">
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="border-b border-gray-200 py-4 flex justify-between items-center">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{post.title}</h2>
                <p className="text-gray-500 text-sm mb-2">
                  {new Date(post.createdAt!).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-gray-600">
                  {post.description.length > 50
                    ? `${post.description.substring(0, 50)}...`
                    : post.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.split(',').map((tag, index) => (
                    <span key={index} className="bg-red-50 text-red-600 py-1 px-2 rounded-full text-sm">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <button onClick={() => handleEdit(post)} className="text-blue-500 hover:text-blue-700 p-2">
                  <MdEdit size="24" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700 p-2">
                  <MdDelete size="24" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg z-10">
            <h2 className="font-bold text-lg mb-4">Confirmar Exclusão</h2>
            <p>Tem certeza de que deseja excluir este post?</p>
            <div className="flex justify-around mt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black">Cancelar</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white">Excluir</button>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && editedPost && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-96">
            <h2 className="font-bold text-lg mb-4">Editar Post</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Título:</label>
              <input 
                type="text" 
                value={editedPost.title} 
                onChange={(e) => setEditedPost({...editedPost, title: e.target.value})} 
                className="border rounded w-full px-3 py-2 mb-2"
                placeholder="Digite o título do post"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Descrição:</label>
              <textarea 
                value={editedPost.description} 
                onChange={(e) => setEditedPost({...editedPost, description: e.target.value})} 
                className="border rounded w-full px-3 py-2 mb-2" 
                rows={4}
                placeholder="Digite a descrição do post"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Tags:</label>
              <input 
                type="text" 
                value={editedPost.tags} 
                onChange={(e) => setEditedPost({...editedPost, tags: e.target.value})} 
                className="border rounded w-full px-3 py-2 mb-2"
                placeholder="Digite as tags separadas por vírgula"
              />
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black">Cancelar</button>
              <button onClick={handleUpdate} className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white">Atualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPostPage;
