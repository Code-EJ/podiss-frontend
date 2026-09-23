import { useEffect, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { notifications, type Notice } from '../../feedback/notifications';
import { activity } from '../../feedback/activity';
import { Button } from '../ui/button';

const styles = { loading: 'border-amber-300 bg-amber-50 text-amber-900', success: 'border-emerald-300 bg-emerald-50 text-emerald-900', error: 'border-rose-300 bg-rose-50 text-rose-900' };
const labels = { loading: 'Processando', success: 'Sucesso', error: 'Erro' };
/** One global live region and truthful indeterminate network indicator; no fabricated percentage. @author oEnzoRibas */
export function FeedbackCenter() {
  const items = useSyncExternalStore(notifications.subscribe, notifications.snapshot);
  const count = useSyncExternalStore(activity.subscribe, activity.snapshot);
  return <>
    {count > 0 && <div role="progressbar" aria-label="Requisições em andamento" className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-1 bg-amber-100">
      <div className="top-loader h-full w-1/3 bg-amber-500" />
    </div>}
    <aside aria-label="Notificações" className="pointer-events-none fixed bottom-4 right-4 z-[90] w-[calc(100%_-_2rem)] max-w-sm space-y-3">
      <AnimatePresence initial={false}>{items.map(item => <Toast key={item.id} item={item} />)}</AnimatePresence>
    </aside>
  </>;
}
function Toast({ item }: { item: Notice }) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (item.tone !== 'success' || paused) return;
    const timeout = window.setTimeout(() => notifications.dismiss(item.id), 6000);
    return () => window.clearTimeout(timeout);
  }, [item.id, item.tone, paused]);
  return <motion.div layout={!reduced} initial={{ opacity: 0, y: reduced ? 0 : 12 }}
    animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.18 }}
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
    onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
    className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg ${styles[item.tone]}`}>
    <div className="min-w-0 flex-1" role={item.tone === 'error' ? 'alert' : 'status'} aria-atomic="true">
      <p className="text-sm font-bold">{labels[item.tone]}</p><p className="break-words text-sm">{item.message}</p>
    </div>
    {item.tone !== 'loading' && <Button variant="secondary" aria-label="Fechar notificação" onClick={() => notifications.dismiss(item.id)}>×</Button>}
  </motion.div>;
}
