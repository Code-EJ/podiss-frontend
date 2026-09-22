import React from 'react';
import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import { Pagination } from '../../components/pagination';
import type { ContactResponse } from '../../types/api';

/** Protected paginated inbox; Portuguese properties match the HTTP contract. @author oEnzoRibas */
const MessageListPage: React.FC = () => {
  const result = usePaginatedResource<ContactResponse>('/contatos');
  const { items: messages, loading, error } = result;
  if (loading) return <p role="status">Carregando...</p>;
  if (error) return <p role="alert" className="text-red-600">{error}</p>;
  return (
    <div className="p-4">
      <Pagination {...result} />
      <h1 className="text-2xl font-bold mb-4">Mensagens Recebidas</h1>
      {messages.length === 0 ? (
        <p>Nenhuma mensagem encontrada.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Nome</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Assunto</th>
              <th className="px-4 py-2 border">Mensagem</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td className="px-4 py-2 border">{message.nome}</td>
                <td className="px-4 py-2 border">{message.email}</td>
                <td className="px-4 py-2 border">{message.assunto}</td>
                <td className="px-4 py-2 border">{message.mensagem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MessageListPage;
