import { adminNavigation } from '../../navigation/navigation-items';
import { NavigationLinks } from '../navigation/navigation-links';

/** Panel-only links; global navigation and session actions belong to SiteNavbar. @author oEnzoRibas */
export default function AdminSidebar() {
  return <aside className="w-full shrink-0 bg-gray-100 p-4 shadow-md lg:w-64">
    <h2 className="mb-4 text-lg font-semibold">Admin</h2>
    <nav aria-label="Navegação administrativa"><NavigationLinks items={adminNavigation} variant="admin" /></nav>
  </aside>;
}
