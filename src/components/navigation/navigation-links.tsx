import { Link, matchPath, useLocation } from 'react-router-dom';
import type { NavigationItem } from '../../navigation/navigation-items';

interface NavigationLinksProps {
  items: readonly NavigationItem[];
  onNavigate?: () => void;
  variant?: 'public' | 'admin';
}

/** Renders one menu for both responsive layouts, including active parent links on detail pages. @author oEnzoRibas */
export function NavigationLinks({ items, onNavigate, variant = 'public' }: NavigationLinksProps) {
  const { pathname } = useLocation();
  const base = variant === 'admin'
    ? 'block rounded-md p-3 hover:bg-gray-200'
    : 'block rounded-md px-3 py-2 text-lg font-semibold text-custom-red hover:bg-red-50';
  return <ul className={variant === 'admin' ? 'space-y-1' : 'flex flex-col gap-1 xl:flex-row xl:items-center'}>
    {items.map(({ to, label, end, activePatterns }) => {
      const groupActive = activePatterns?.some(path => matchPath({ path, end: true }, pathname)) ?? false;
      const active = groupActive || Boolean(matchPath({ path: to, end: end ?? false }, pathname));
      return <li key={to}>
      <Link to={to} onClick={onNavigate} aria-current={active ? 'page' : undefined}
        className={`${base} ${active ? 'bg-red-50 font-bold underline underline-offset-4' : ''}`}>
        {label}
      </Link>
    </li>; })}
  </ul>;
}
