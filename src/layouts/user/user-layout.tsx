import { Outlet } from 'react-router-dom';
import UserNavbar from '../../components/user/user-navbar';
import Footer from '../../components/user/footer';


/**
 * Hosts public navigation, page content and the existing editorial footer.
 * @author oEnzoRibas
 */
const UserLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <UserNavbar />
            <main className="flex-grow pt-28">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default UserLayout;
