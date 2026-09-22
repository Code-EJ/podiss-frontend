import { postImageUrl } from '../../services/api-paths';
import { routes } from '../../navigation/routes';
import { parseTags } from '../../domain/post';
import { formatDate } from '../../domain/display';
// src/components/PostItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTags } from 'react-icons/fa';

import type { Post } from '../../types/api';

interface PostItemProps {
  post: Post;
}

/**
 * Displays a post summary; requests binary image data only when the API reports an image.
 * @author oEnzoRibas
 */
const PostItem: React.FC<PostItemProps> = ({ post }) => {



  const getPreview = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  };



  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
      {post.hasImage && <img alt={post.title} src={postImageUrl(post.id)}/>}
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-4">{getPreview(post.description, 100)}</p>
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
      <p className="text-gray-500 text-sm mb-4">{formatDate(post.createdAt, true)}</p>
      <Link to={routes.post(post.id)} className="text-blue-500 hover:underline">
        Ler Mais
      </Link>
    </div>
  );
};

export default PostItem;
