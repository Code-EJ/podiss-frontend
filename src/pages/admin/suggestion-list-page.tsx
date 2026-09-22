import React from 'react';
import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import { Pagination } from '../../components/pagination';
import type { SuggestionResponse } from '../../types/api';

/** Protected paginated inbox; Portuguese properties match the HTTP contract. @author oEnzoRibas */
const SuggestionListPage: React.FC = () => {
  const result = usePaginatedResource<SuggestionResponse>('/sugestoes');
  const { items: suggestions, loading, error } = result;
  if (loading) return <p role="status">Carregando...</p>;
  if (error) return <p role="alert" className="text-red-600">{error}</p>;
  return (
    <div className="p-4">
      <Pagination {...result} />
      <h1 className="text-2xl font-bold mb-4">Sugestões Recebidas</h1>
      {suggestions.length === 0 ? (
        <p>Nenhuma sugestão encontrada.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Nome</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Tema</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((suggestion) => (
              <tr key={suggestion.id}>
                <td className="px-4 py-2 border">{suggestion.nome}</td>
                <td className="px-4 py-2 border">{suggestion.email}</td>
                <td className="px-4 py-2 border">{suggestion.tema}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SuggestionListPage;
