// src/components/user/UserNavbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importando ícones do react-icons/fa

/**
 * Provides public navigation in desktop and mobile layouts; labels remain in Portuguese.
 * @author oEnzoRibas
 */
const UserNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full bg-white shadow-box-shadow fixed top-0 left-0 z-50">
      <div className="w-full px-6 sm:px-8 lg:px-12 h-28 flex items-center justify-between">
        {/* Logo */}
        <div className="">
          <img src="/logo-podiss.svg" alt="Logo" className="h-16 w-auto" />
        </div>

        {/* Menu de Navegação Principal */}
        <div className="hidden md:flex items-center gap-9">
          <Link
            className="text-custom-red text-3xl font-semibold hover:text-red-700 hover:border-b-2 hover:border-red-700 transition duration-300"
            to="/"
          >
            Home
          </Link>
          <Link
            className="text-custom-red text-3xl font-semibold hover:text-red-700 hover:border-b-2 hover:border-red-700 transition duration-300"
            to="/home/posts"
          >
            Nossos Posts
          </Link>
          <Link
            className="text-custom-red text-3xl font-semibold hover:text-red-700 hover:border-b-2 hover:border-red-700 transition duration-300"
            to="/home/episodes"
          >
            Todos os Episódios
          </Link>
          <Link
            className="text-custom-red text-3xl font-semibold hover:text-red-700 hover:border-b-2 hover:border-red-700 transition duration-300"
            to="/home/about"
          >
            Sobre Nós
          </Link>
          <Link to="/admin/login" className="bg-red-500 hover:bg-red-600 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
              <span className="text-white">Login</span>
          </Link>
        </div>

        {/* Botão de Menu para Dispositivos Móveis */}
        <div className="md:hidden">
          <button
            onClick={handleToggle}
            type="button"
            className="text-custom-red hover:text-red-700 focus:outline-none focus:text-red-700"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <FaTimes className="h-8 w-8" />
            ) : (
              <FaBars className="h-8 w-8" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Móvel */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden bg-white shadow-box-shadow">
          <div className="px-6 pt-2 pb-3 space-y-1 sm:px-8">
            <Link
              onClick={() => setIsOpen(false)}
              className="block text-custom-red text-2xl font-semibold hover:text-red-700 hover:bg-gray-100 rounded-md px-3 py-2 transition duration-300"
              to="/"
            >
              Home
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              className="block text-custom-red text-2xl font-semibold hover:text-red-700 hover:bg-gray-100 rounded-md px-3 py-2 transition duration-300"
              to="/home/posts"
            >
              Nossos Posts
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              className="block text-custom-red text-2xl font-semibold hover:text-red-700 hover:bg-gray-100 rounded-md px-3 py-2 transition duration-300"
              to="/home/episodes"
            >
              Todos os Episódios
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              className="block text-custom-red text-2xl font-semibold hover:text-red-700 hover:bg-gray-100 rounded-md px-3 py-2 transition duration-300"
              to="/home/about"
            >
              Sobre Nós
            </Link>
            <Link to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="block text-center w-full bg-red-500 hover:bg-red-600 font-bold py-2 px-4 rounded-lg shadow-md text-white transition duration-300">
                Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
