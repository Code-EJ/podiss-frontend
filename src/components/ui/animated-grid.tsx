import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

/** Stable resource keys preserve enter/exit and reposition animations after a server refresh. @author oEnzoRibas */
export function AnimatedGrid<T extends { id: string }>({ items, children }: { items: T[]; children: (item: T) => ReactNode }) {
  const reduced = useReducedMotion();
  return <div className="relative grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
    <AnimatePresence initial={false} mode="popLayout">
      {items.map(item => <motion.div key={item.id} layout={!reduced}
        initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }} transition={{ duration: reduced ? 0 : 0.18 }}
        className="min-w-0">{children(item)}</motion.div>)}
    </AnimatePresence>
  </div>;
}
