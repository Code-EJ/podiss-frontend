import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { publicNavigation } from '../../navigation/navigation-items';
import { routes } from '../../navigation/routes';
import { siteContent } from '../../content/site-content';
import { NavigationLinks } from './navigation-links';
import { SessionActions } from './session-actions';

/** Global responsive navigation, shared by public pages, login, errors and the panel. @author oEnzoRibas */
export function SiteNavbar() {
  const [isOpen, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const close = () => setOpen(false);
  useEffect(close, [location.pathname]);
  return <header className="sticky top-0 z-40 bg-white shadow-md">
    <nav aria-label="Navegação principal" className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-4 py-3"
      onKeyDown={event => {
        if (event.key === 'Escape' && isOpen) { close(); toggle.current?.focus(); }
      }}>
      <Link to={routes.home} onClick={close} aria-label={`${siteContent.name} — início`}>
        <img src={siteContent.logo} alt={siteContent.name} className="h-16 w-auto" />
      </Link>
      <button ref={toggle} type="button" className="rounded p-3 text-custom-red xl:hidden"
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={isOpen} aria-controls="site-menu"
        onClick={() => setOpen(open => !open)}>
        {isOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
      </button>
      <div id="site-menu" className={`${isOpen ? 'flex' : 'hidden'} w-full flex-col gap-3 xl:flex xl:w-auto xl:flex-row xl:items-center`}>
        <NavigationLinks items={publicNavigation} onNavigate={close} />
        <SessionActions onNavigate={close} />
      </div>
    </nav>
  </header>;
}
