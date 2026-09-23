/** Bounded notification state; messages must not contain credentials or submitted personal data. @author oEnzoRibas */
export type NoticeTone = 'loading' | 'success' | 'error';
export interface Notice { id: number; tone: NoticeTone; message: string }
let nextId = 0;
let notices: Notice[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());
export const notifications = {
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  snapshot: () => notices,
  show(tone: NoticeTone, message: string) {
    const id = ++nextId; notices = [...notices, { id, tone, message }].slice(-5); emit(); return id;
  },
  update(id: number, tone: NoticeTone, message: string) {
    notices = notices.map(item => item.id === id ? { id, tone, message } : item); emit();
  },
  dismiss(id: number) { notices = notices.filter(item => item.id !== id); emit(); },
  clear() { notices = []; emit(); },
};
