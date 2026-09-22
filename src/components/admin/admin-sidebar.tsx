// components/admin/SidebarAdmin.tsx
import React from 'react';
import { AiOutlineFileAdd, AiOutlineUnorderedList, AiOutlineVideoCamera } from 'react-icons/ai';
import { MdOutlineLightbulb, MdOutlineLibraryAdd, MdLogout } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../auth-context';
import { TbMessage } from 'react-icons/tb';


/**
 * Provides keyboard-accessible administrator navigation and logout. Active selection follows the current URL.
 * @author oEnzoRibas
 */
const SidebarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = React.useContext(AuthContext);
  const activeMenu = location.pathname;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="h-screen w-64 bg-gray-100 shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between p-4 bg-white">
          <h1 className="text-lg font-semibold">Admin</h1>

        </div>

        <nav className="mt-4">
          <ul>
            <li>
              <button type="button"
              className={`w-full p-4 flex items-center hover:bg-gray-200 cursor-pointer transition rounded-md ${
                activeMenu === '/admin/create-post' ? 'bg-blue-200 font-bold shadow-lg' : ''
              }`}
              onClick={() => handleNavigation('/admin/create-post')}
            >
              <AiOutlineFileAdd className="mr-3" />
              Criar Post
              </button>
            </li>

            <li>
              <button type="button"
              className={`p-4 flex items-center hover:bg-gray-200 cursor-pointer transition rounded-md ${
                activeMenu === '/admin' ? 'bg-blue-200 font-bold shadow-lg' : ''
              }`}
              onClick={() => handleNavigation('/admin')}
            >
              <AiOutlineUnorderedList className="mr-3" />
              Listar Post
              </button>
            </li>

            <li>
              <button type="button"
              className={`p-4 flex items-center hover:bg-gray-200 cursor-pointer transition rounded-md ${
                activeMenu === '/admin/create-episode' ? 'bg-blue-200 font-bold shadow-lg' : ''
              }`}
              onClick={() => handleNavigation('/admin/create-episode')}
            >
              <AiOutlineVideoCamera className="mr-3" />
              Criar Episódio
              </button>
            </li>

            <li>
              <button type="button"
              className={`p-4 flex items-center hover:bg-gray-200 cursor-pointer transition rounded-md ${
                activeMenu === '/admin/episodes-admin' ? 'bg-blue-200 font-bold shadow-lg' : ''
              }`}
              onClick={() => handleNavigation('/admin/episodes-admin')}
            >
              <MdOutlineLibraryAdd className="mr-3" />
              Listar Episódios
              </button>
            </li>
            <li>
              <button type="button"
              className={`p-4 flex items-center hover:bg-gray-200 cursor-pointer transition rounded-md ${
                activeMenu === '/admin/suggestions' ? 'bg-blue-200 font-bold shadow-lg' : ''
              }`}
              onClick={() => handleNavigation('/admin/suggestions')}
            >
              <MdOutlineLightbulb className="mr-3" />
              Sugestões Recebidas
              </button>
            </li>

            <li>
              <button type="button"
              className={`p-4 flex items-center hover:bg-gray-200 cursor-pointer transition rounded-md ${
                activeMenu === '/admin/messages' ? 'bg-blue-200 font-bold shadow-lg' : ''
              }`}
              onClick={() => handleNavigation('/admin/messages')}
            >
              <TbMessage className="mr-3" />
              Mensagens Recebidas
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          <MdLogout className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarAdmin;
