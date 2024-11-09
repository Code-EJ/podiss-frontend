// src/layouts/UserLayout.tsx
import { Outlet } from 'react-router-dom';
import UserNavbar from '../../components/user/user-navbar';
import Footer from '../../components/user/footer';
import SuggestionForm from '../../components/user/suggestion-form';
import ContactForm from '../../components/user/contact-form';

const UserLayout = () => {

  return (
    <div className="relative min-h-screen">
      <div
      ></div>
      <div className="relative min-h-screen">
        <UserNavbar />
        <main>

          <Outlet />

          <div className="flex flex-col sm:flex-row sm:gap-8 p-6 justify-center items-center flex-1">
            <div className="w-full sm:w-1/2">
              <SuggestionForm />
            </div>

            <div className="w-full sm:w-1/2">
              <ContactForm />
            </div>
          </div>

        </main>
        <Footer />
      </div>

    </div>
  );
};

export default UserLayout;
