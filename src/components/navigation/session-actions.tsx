import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth-context';
import { sessionLabels } from '../../navigation/navigation-items';
import { routes } from '../../navigation/routes';

/** Adapts server-verified auth state into UI actions; never derives roles from JWT claims. @author oEnzoRibas */
export function SessionActions({ onNavigate }: { onNavigate: () => void }) {
  const { isLoggedIn, isChecking, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  if (isChecking) return <span role="status">{sessionLabels.checking}</span>;
  const linkClass = 'block rounded-lg bg-red-500 px-4 py-2 text-center font-bold text-white hover:bg-red-600';
  if (!isLoggedIn) return <Link to={routes.login} onClick={onNavigate} className={linkClass}>{sessionLabels.login}</Link>;
  return <div className="flex flex-wrap gap-2">
    <Link to={routes.admin} onClick={onNavigate} className={linkClass}>{sessionLabels.panel}</Link>
    <button type="button" className="rounded-lg border border-red-500 px-4 py-2 text-red-700"
      onClick={() => { logout(); onNavigate(); navigate(routes.login, { replace: true }); }}>
      {sessionLabels.logout}
    </button>
  </div>;
}
