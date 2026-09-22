import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { SiteNavbar } from '../components/navigation/site-navbar';
import { SiteFooter } from '../components/shared/site-footer';

/** Owns global chrome and the single main landmark; pages render content only. @author oEnzoRibas */
export function SiteLayout() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  return <div className="flex min-h-screen flex-col">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:p-3">Ir para o conteúdo</a>
    <SiteNavbar />
    <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">
      <motion.div key={pathname} initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.16 }}><Outlet /></motion.div>
    </main>
    <SiteFooter />
  </div>;
}
