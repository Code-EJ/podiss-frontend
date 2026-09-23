import { Link } from 'react-router-dom';
import { routes } from '../../navigation/routes';

/** Recoverable route fallback inside the shared site layout. @author oEnzoRibas */
export function NotFoundPage({ admin = false }: { admin?: boolean }) {
  return <section className="p-6">
    <h1>Página não encontrada.</h1>
    <Link to={admin ? routes.admin : routes.home}>{admin ? 'Voltar ao painel' : 'Voltar ao início'}</Link>
  </section>;
}
