// src/components/PostItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTags } from 'react-icons/fa';

interface Post {
  id: string;
  title: string;
  description: string;
  tags: string;
  createdAt: string;
}

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  
  const getPreview = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  };

 
  const getTags = (tags: string) => {
    return tags.split(',').map((tag) => tag.trim());
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-4">{getPreview(post.description, 100)}</p>
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
      <p className="text-gray-500 text-sm mb-4">{formatDate(post.createdAt)}</p>
      <Link to={`/posts/${post.id}`} className="text-blue-500 hover:underline">
        Ler Mais
      </Link>
    </div>
  );
};

export default PostItem;
