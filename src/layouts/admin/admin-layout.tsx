import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/admin-sidebar';

/** Adds panel-specific navigation without duplicating the site header, footer or main landmark. @author oEnzoRibas */
export default function AdminLayout() {
  return <div className="flex flex-col lg:flex-row">
    <AdminSidebar />
    <div className="min-w-0 flex-1 overflow-x-auto bg-white"><Outlet /></div>
  </div>;
}
