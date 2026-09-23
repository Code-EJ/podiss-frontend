/** Browser URLs only; never reuse these as backend endpoint names. @author oEnzoRibas */
export const routes = {
  home: '/', publicHome: '/home', posts: '/home/posts', episodes: '/home/episodes', about: '/home/about',
  postPattern: '/posts/:id', videoPattern: '/video/:id',
  login: '/admin/login', admin: '/admin', createPost: '/admin/create-post',
  createEpisode: '/admin/create-episode', adminEpisodes: '/admin/episodes-admin',
  messages: '/admin/messages', suggestions: '/admin/suggestions',
  post: (id: string) => `/posts/${encodeURIComponent(id)}`,
  video: (id: string) => `/video/${encodeURIComponent(id)}`,
} as const;

/** Bookmarks retained until an explicit contract migration is approved. @author oEnzoRibas */
export const legacyRedirects = [
  { from: '/home/sobre-nos', to: routes.about },
  { from: '/admin/mensagens-admin', to: routes.messages },
  { from: '/admin/sugestoes-admin', to: routes.suggestions },
] as const;

/** Only known panel routes may be used as a post-login return destination. @author oEnzoRibas */
export function adminReturnPath(path: unknown): string {
  const allowed: readonly string[] = [routes.admin, routes.createPost, routes.createEpisode,
    routes.adminEpisodes, routes.messages, routes.suggestions];
  return typeof path === 'string' && allowed.includes(path) ? path : routes.admin;
}
