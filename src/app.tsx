// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import UserLayout from './layouts/user/user-layout';
import UserHomePage from './pages/user/user-homepage';
import { VideoPlayerPage } from './pages/user/video-player-page';
import AdminLoginPage from './pages/admin/login-page';

import AdminLayout from './layouts/admin/admin-layout';
import CreatePostPage from './pages/admin/create-post-page';

import CreateEpisodePage from './pages/admin/create-episode-page';
import ListPostPage from './pages/admin/list-post-page';
import RequireAuth from './require-auth';
import EpisodeListPage from './pages/admin/episode-list-page';
import PostListPage from './pages/user/user-list-post-page';
import PostDetailPage from './pages/user/post-detail-page';
import UserEpisodes from './pages/user/user-homepage';
import LandingPage from './pages/user/landing-page';
import AboutUs from './pages/user/about-us';
import SuggestionListPage from './pages/admin/suggestion-list-page';
import MessageListPage from './pages/admin/message-list-page';


/**
 * Defines public and administrator routes. English route names preserve legacy URLs through redirects.
 * @author oEnzoRibas
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/home" element={<UserLayout />}>
          <Route path="about" element={<AboutUs />} />
          <Route path="sobre-nos" element={<Navigate to="/home/about" replace />} />
          <Route index element={<UserHomePage />} />
          <Route path="episodes" element={<UserEpisodes />} />
          <Route path="posts" element={<PostListPage />} />

        </Route>

        {/* Adicionar a rota "/video/:id" no nível superior */}
        <Route path="/video/:id" element={<VideoPlayerPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />

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
          <Route path="suggestions" element={<SuggestionListPage />} />
          <Route path="messages" element={<MessageListPage />} />
          <Route path="sugestoes-admin" element={<Navigate to="/admin/suggestions" replace />} />
          <Route path="mensagens-admin" element={<Navigate to="/admin/messages" replace />} />
          <Route path="*" element={<p>Página não encontrada. <Link to="/admin">Voltar ao painel</Link></p>} />
        </Route>
        <Route path="*" element={<p>Página não encontrada. <Link to="/">Voltar ao início</Link></p>} />
      </Routes>
    </Router>
  );
};

export default App;
