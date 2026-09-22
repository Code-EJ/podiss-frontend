import { Inbox } from '../../components/admin/inbox';
import { apiPaths } from '../../services/api-paths';
import type { SuggestionResponse } from '../../types/api';
/** Maps suggestion wire fields into the same inbox without translating the external contract. @author oEnzoRibas */
export default function SuggestionListPage() {
  return <Inbox<SuggestionResponse> path={apiPaths.suggestions} title="Sugestões Recebidas" empty="Nenhuma sugestão encontrada."
    fields={[{ key: 'nome', label: 'Nome' }, { key: 'email', label: 'Email' }, { key: 'tema', label: 'Tema' }]} />;
}
