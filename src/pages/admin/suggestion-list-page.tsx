import React, { useEffect, useState, useContext } from 'react';
import GetUrl from '../../database';
import { AuthContext } from '../../auth-context';

interface Sugestao {
  id: string;
  nome: string;
  email: string;
  tema: string;
}

const SuggestionListPage: React.FC = () => {
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      console.error("Token não encontrado. Você precisa estar autenticado.");
      return;
    }

    fetch(`${GetUrl()}/sugestoes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao obter sugestões');
        }
        return response.json();
      })
      .then(data => {
        const sugestoesInvertidas = data.reverse();
        setSugestoes(sugestoesInvertidas);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar sugestões:", error);
        setLoading(false);
      });
  }, [token]);

  if (!token) {
    return <div>Você não está autenticado.</div>;
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sugestões Recebidas</h1>
      {sugestoes.length === 0 ? (
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
            {sugestoes.map((sugestao) => (
              <tr key={sugestao.id}>
                <td className="px-4 py-2 border">{sugestao.nome}</td>
                <td className="px-4 py-2 border">{sugestao.email}</td>
                <td className="px-4 py-2 border">{sugestao.tema}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SuggestionListPage;
