// src/layouts/UserLayout.tsx
import { Outlet } from 'react-router-dom';
import UserNavbar from '../../components/user/user-navbar';

const UserLayout = () => {
  return (
    <div className="relative min-h-screen">
      <div
      ></div>
      <div className="relative min-h-screen">
        <UserNavbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
