
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../../components/admin/admin-sidebar';


/**
 * Hosts the administrator sidebar and nested content; RequireAuth guards this layout at the route boundary.
 * @author oEnzoRibas
 */
const AdminLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar específica do administrador */}
      <SidebarAdmin />

      {/* Conteúdo principal do admin */}
      <div className="flex-1 bg-white min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
