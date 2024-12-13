// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLayout from './layouts/user/user-layout';
import UserHomePage from './pages/user/user-homepage';
import { VideoPlayerPage } from './pages/user/video-player-page';
import AdminLoginPage from './pages/admin/LoginAdminPage';

import AdminLayout from './layouts/admin/admin-layout';
import CreatePostPage from './pages/admin/create-post-page';

import CreateEpisodePage from './pages/admin/admin-episode-page';
import ListPostPage from './pages/admin/list-post-page';
import RequireAuth from './require-auth';
import EpisodeListPage from './pages/admin/epidode-list-page-admin';
import PostListPage from './pages/user/user-list-post-page';
import PostDetailPage from './pages/user/post-detail-page';
import UserEpisodes from './pages/user/user-homepage';
import UserInitialPetry from './pages/user/user-initial-petry';
import AboutUs from './pages/user/about-us';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<UserInitialPetry />}>
          <Route path="" element={<UserEpisodes />} />
        </Route>

        <Route path="/home" element={<UserLayout />}>
          <Route path='sobre-nos' element={<AboutUs/>} />
          <Route index element={<UserHomePage />} />
          <Route path="episodes" element={<UserEpisodes />} />
          <Route path="posts" element={<PostListPage />} />
          
        </Route>

        {/* Adicionar a rota "/video/:id" no nível superior */}
        <Route path="/video/:id" element={<VideoPlayerPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />

        {/* Rotas de Administração */}
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<ListPostPage />} />
          <Route path="create-post" element={<CreatePostPage />} />
          <Route path="create-episode" element={<CreateEpisodePage />} />
          <Route path="episodes-admin" element={<EpisodeListPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App; 
