// src/components/user/UserNavbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const UserNavbar: React.FC = () => {
  return (
    <div className="w-full h-28 flex bg-white py-3 gap-5 items-center px-8 shadow-box-shadow">
      <img src="/logo-yolanda.svg.svg" alt="Logo" />
      <div className="flex items-center gap-9 ml-auto">
      <Link className="text-custom-red text-3xl font-semibold hover:text-red-700" to="/posts">
          Nossos Posts
        </Link>
        <Link className="text-custom-red text-3xl font-semibold hover:text-red-700" to="/episodes">
          Todos os Episódios
        </Link>
            
        

        
      </div>
    </div>
  );
};

export default UserNavbar;
