import React, { useEffect, useState, useContext } from 'react';
import { API_URL } from '../../database';
import { AuthContext } from '../../auth-context';

interface Mensagem {
  id: string;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

const MessageListPage: React.FC = () => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      console.error("Token não encontrado. Você precisa estar autenticado.");
      return;
    }

    fetch(`${ API_URL }/contatos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao obter mensagens');
        }
        return response.json();
      })
      .then(data => {
        const mensagensInvertidas = data.reverse();
        setMensagens(mensagensInvertidas);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar mensagens:", error);
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
      <h1 className="text-2xl font-bold mb-4">Mensagens Recebidas</h1>
      {mensagens.length === 0 ? (
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
            {mensagens.map((mensagem) => (
              <tr key={mensagem.id}>
                <td className="px-4 py-2 border">{mensagem.nome}</td>
                <td className="px-4 py-2 border">{mensagem.email}</td>
                <td className="px-4 py-2 border">{mensagem.assunto}</td>
                <td className="px-4 py-2 border">{mensagem.mensagem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MessageListPage;
