import { useSyncExternalStore } from 'react';
import { postImageUrl } from '../services/api-paths';
import { postImageRevisions } from '../services/post-image-revisions';

/** Refreshes the binary URL without changing the post ID or backend contract. @author oEnzoRibas */
export function usePostImageUrl(id: string): string {
  const revision = useSyncExternalStore(postImageRevisions.subscribe, () => postImageRevisions.get(id));
  return postImageUrl(id) + (revision ? `?v=${revision}` : '');
}
