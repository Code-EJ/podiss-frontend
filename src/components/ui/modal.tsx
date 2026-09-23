import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Button } from './button';

interface ModalProps { open: boolean; title: string; busy?: boolean; onClose: () => void; children: ReactNode }

/** Native modal provides focus containment and an inert background; closing restores the trigger. @author oEnzoRibas */
export function Modal(props: ModalProps) {
  return createPortal(<AnimatePresence>{props.open && <ModalContent key="dialog" {...props} />}</AnimatePresence>, document.body);
}
function ModalContent({ title, busy, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const reduced = useReducedMotion();
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = ref.current!;
    const overflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <motion.dialog ref={ref} aria-labelledby={titleId} aria-modal="true" aria-busy={busy}
    initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: reduced ? 0 : 8 }} transition={{ duration: reduced ? 0 : 0.16 }}
    onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}
    onClick={event => { if (event.target === event.currentTarget && !busy) onClose(); }}
    className="w-[calc(100%_-_2rem)] max-w-xl max-h-[85dvh] overflow-y-auto rounded-xl border-0 bg-white p-0 shadow-xl backdrop:bg-gray-950/50">
    <div className="p-5 sm:p-6">
      <header className="mb-5 flex items-start justify-between gap-4">
        <h2 id={titleId} className="text-xl font-bold text-gray-800">{title}</h2>
        <Button variant="secondary" disabled={busy} aria-label="Fechar janela" onClick={onClose}>×</Button>
      </header>
      {children}
    </div>
  </motion.dialog>;
}
