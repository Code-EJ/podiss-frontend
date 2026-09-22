// src/components/user/UserNavbar.tsx
import React from 'react';

/**
 * Provides legacy in-page section links; currently not mounted by the application routes.
 * @author oEnzoRibas
 */
const SectionNavbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white flex justify-center p-4">
      <a href="#sobre" className="mx-4 hover:bg-gray-700 px-3 py-2 rounded">
        Sobre
      </a>
      <a href="#ultimos-episodios" className="mx-4 hover:bg-gray-700 px-3 py-2 rounded">
        Últimos Episódios
      </a>
      <a href="#destaques" className="mx-4 hover:bg-gray-700 px-3 py-2 rounded">
        Destaques
      </a>
    </nav>
  );
};

export default SectionNavbar;
