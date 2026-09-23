/** Counts concurrent work without coupling transport to React. @author oEnzoRibas */
let pending = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());
export const activity = {
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  snapshot: () => pending,
  begin() {
    pending++; emit();
    let finished = false;
    return () => { if (!finished) { finished = true; pending = Math.max(0, pending - 1); emit(); } };
  },
};
