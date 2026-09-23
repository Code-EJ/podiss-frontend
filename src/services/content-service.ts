import api from '../api';
import { apiPaths } from './api-paths';
import { postForm } from '../domain/post';
import { postImageRevisions } from './post-image-revisions';
import type { ContactPayload, SuggestionPayload, Post, Episode } from '../types/api';

/** Content operations own HTTP payload construction; UI owns fields and user intent. @author oEnzoRibas */
export const contentService = {
  contact: (data: ContactPayload) => api.post(apiPaths.contacts, data),
  suggest: (data: SuggestionPayload) => api.post(apiPaths.suggestions, data),
  createPost: (title: string, description: string, tags: string[], image?: File) =>
    api.post<Post>(apiPaths.posts, postForm(title, description, tags, image)),
  updatePost: (id: string, data: { title: string; description: string; tags: string[] }) => api.put<Post>(apiPaths.post(id), data),
  deletePost: (id: string) => api.delete(apiPaths.post(id)),
  createEpisode: (videoUrl: string) => api.post<Episode>(apiPaths.episodes, { videoUrl }),
  deleteEpisode: (id: string) => api.delete(apiPaths.episode(id)),
  replaceImage: async (id: string, image: File) => {
    const body = postForm('', '', [], image); body.delete('title'); body.delete('description');
    const response = await api.put(apiPaths.postImage(id), body);
    postImageRevisions.invalidate(id);
    return response;
  },
  removeImage: async (id: string) => {
    const response = await api.delete(apiPaths.postImage(id));
    postImageRevisions.invalidate(id);
    return response;
  },
};

/**
 * Saves text and an optional selected image using the existing separate endpoints.
 * Validates the image before writing text; a partial failure is explicitly reported.
 * This is not a transaction across the two HTTP requests.
 * @author oEnzoRibas
 */
export async function savePost(id: string, data: { title: string; description: string; tags: string[] }, image?: File) {
  if (image) postForm('', '', [], image);
  await contentService.updatePost(id, data);
  if (image) {
    try { await contentService.replaceImage(id, image); }
    catch { throw new Error('Texto atualizado, mas não foi possível confirmar a atualização da imagem. Tente novamente.'); }
  }
}
