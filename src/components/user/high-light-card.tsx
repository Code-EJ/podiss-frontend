// src/components/user/HighlightCard.tsx
import React from 'react';

interface HighlightCardProps {
  image: string;
  title: string;
  description: string;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ image, title, description }) => {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300">
      <img src={image} alt={title} className="rounded-md mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">
        Assista Agora
      </button>
    </div>
  );
};

export default HighlightCard;
