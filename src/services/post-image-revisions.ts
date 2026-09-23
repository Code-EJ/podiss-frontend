/** In-memory image revisions invalidate mounted previews only after a successful mutation. @author oEnzoRibas */
const revisions = new Map<string, number>();
const listeners = new Set<() => void>();
export const postImageRevisions = {
  get: (id: string) => revisions.get(id) ?? 0,
  subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
  invalidate: (id: string) => {
    revisions.set(id, Math.max(Date.now(), (revisions.get(id) ?? 0) + 1));
    listeners.forEach(listener => listener());
  },
};
