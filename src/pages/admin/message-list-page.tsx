import { Inbox } from '../../components/admin/inbox';
import { apiPaths } from '../../services/api-paths';
import type { ContactResponse } from '../../types/api';
/** Maps the Portuguese contact wire fields into the shared protected inbox. @author oEnzoRibas */
export default function MessageListPage() {
  return <Inbox<ContactResponse> path={apiPaths.contacts} title="Mensagens Recebidas" empty="Nenhuma mensagem encontrada."
    fields={[{ key: 'nome', label: 'Nome' }, { key: 'email', label: 'Email' }, { key: 'assunto', label: 'Assunto' }, { key: 'mensagem', label: 'Mensagem' }]} />;
}
