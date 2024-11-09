// src/components/user/Header.tsx
import React from 'react';

interface HeaderProps {
  onToggleLoginModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleLoginModal }) => {
  return (
    <header className="bg-red-500 text-white flex justify-between items-center p-5 shadow-md">
      <div className="flex items-center">
        <img src="/Logo.jpg" alt="Logo do Podcast" className="h-12 mr-4" />
        <h1 className="text-2xl font-bold">Ô trem bão! Bem-vindo ao Podcast</h1>
      </div>
      <div>
        <button
          className="border-2 border-white px-4 py-2 rounded hover:bg-white hover:text-red-500 transition duration-300"
          onClick={onToggleLoginModal}
        >
          Entrá
        </button>
      </div>
    </header>
  );
};

export default Header;
