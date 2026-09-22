import { Outlet } from 'react-router-dom';
import { SiteNavbar } from '../components/navigation/site-navbar';
import { SiteFooter } from '../components/shared/site-footer';

/** Owns global chrome and the single main landmark; pages render content only. @author oEnzoRibas */
export function SiteLayout() {
  return <div className="flex min-h-screen flex-col">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:p-3">Ir para o conteúdo</a>
    <SiteNavbar />
    <main id="main-content" tabIndex={-1} className="min-w-0 flex-1"><Outlet /></main>
    <SiteFooter />
  </div>;
}
