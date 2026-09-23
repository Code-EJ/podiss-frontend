import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './layouts/site-layout';
import AdminLayout from './layouts/admin/admin-layout';
import RequireAuth from './require-auth';
import LandingPage from './pages/user/landing-page';
import UserHomePage from './pages/user/user-homepage';
import PostListPage from './pages/user/user-list-post-page';
import PostDetailPage from './pages/user/post-detail-page';
import AboutUs from './pages/user/about-us';
import { VideoPlayerPage } from './pages/user/video-player-page';
import AdminLoginPage from './pages/admin/login-page';
import CreatePostPage from './pages/admin/create-post-page';
import CreateEpisodePage from './pages/admin/create-episode-page';
import ListPostPage from './pages/admin/list-post-page';
import EpisodeListPage from './pages/admin/episode-list-page';
import SuggestionListPage from './pages/admin/suggestion-list-page';
import MessageListPage from './pages/admin/message-list-page';
import { NotFoundPage } from './components/shared/not-found-page';
import { legacyRedirects, routes } from './navigation/routes';

/** Composes shared chrome, public routes and the server-verified administrator boundary. @author oEnzoRibas */
export default function App() {
  return <BrowserRouter><Routes>
    <Route element={<SiteLayout />}>
      <Route path={routes.home} element={<LandingPage />} />
      <Route path={routes.publicHome} element={<UserHomePage />} />
      <Route path={routes.episodes} element={<UserHomePage />} />
      <Route path={routes.posts} element={<PostListPage />} />
      <Route path={routes.about} element={<AboutUs />} />
      <Route path={routes.videoPattern} element={<VideoPlayerPage />} />
      <Route path={routes.postPattern} element={<PostDetailPage />} />
      <Route path={routes.login} element={<AdminLoginPage />} />
      <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route path={routes.admin} element={<ListPostPage />} />
        <Route path={routes.createPost} element={<CreatePostPage />} />
        <Route path={routes.createEpisode} element={<CreateEpisodePage />} />
        <Route path={routes.adminEpisodes} element={<EpisodeListPage />} />
        <Route path={routes.suggestions} element={<SuggestionListPage />} />
        <Route path={routes.messages} element={<MessageListPage />} />
        <Route path={`${routes.admin}/*`} element={<NotFoundPage admin />} />
      </Route>
      {legacyRedirects.map(({ from, to }) => <Route key={from} path={from} element={<Navigate to={to} replace />} />)}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes></BrowserRouter>;
}
