import { API_URL } from '../config';

/** HTTP contract names, independent from browser routes and editorial labels. @author oEnzoRibas */
export const apiPaths = {
  login: '/api/auth/login', contacts: '/contatos', suggestions: '/sugestoes',
  posts: '/posts', episodes: '/episodes',
  post: (id: string) => `/posts/${encodeURIComponent(id)}`,
  episode: (id: string) => `/episodes/${encodeURIComponent(id)}`,
  postImage: (id: string) => `/posts/${encodeURIComponent(id)}/image`,
  postImageRead: (id: string) => `/posts/image/${encodeURIComponent(id)}`,
} as const;

/** Binary images use the configured API origin, never a frontend-relative URL. @author oEnzoRibas */
export function postImageUrl(id: string): string { return API_URL + apiPaths.postImageRead(id); }
