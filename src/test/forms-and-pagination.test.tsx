import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AxiosHeaders } from 'axios';
import api from '../api';
import ContactForm from '../components/user/contact-form';
import SuggestionForm from '../components/user/suggestion-form';
import { Pagination } from '../components/pagination';
import { usePaginatedResource } from '../hooks/use-paginated-resource';
import { AuthProvider } from '../auth-provider';
import { AuthContext } from '../auth-context';
import { useContext } from 'react';
import { saveSession } from '../auth-session';

/** Verifies user-visible controls against the backend contract, without a database. @author oEnzoRibas */
describe('forms', () => {
  it('sends Portuguese contact keys and clears successful input', async () => {
    const post = vi.spyOn(api, 'post').mockResolvedValue({ data: { id: 'test' } });
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ContactForm />);
    for (const [label, value] of Object.entries({ Nome: 'Teste', Email: 'teste@example.com', Assunto: 'Assunto', Mensagem: 'Mensagem' }))
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    fireEvent.click(screen.getByRole('button', { name: 'Manda pra nóis!' }));
    await waitFor(() => expect(post).toHaveBeenCalledWith('/contatos',
      { nome: 'Teste', email: 'teste@example.com', assunto: 'Assunto', mensagem: 'Mensagem' }));
    await waitFor(() => expect(screen.getByLabelText('Nome')).toHaveValue(''));
  });
  it('preserves suggestion input when submission fails', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new Error('Falha de teste'));
    render(<SuggestionForm />);
    for (const [label, value] of Object.entries({ Nome: 'Teste', Email: 'teste@example.com', Tema: 'Ciência' }))
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    fireEvent.click(screen.getByRole('button', { name: 'Manda pra nóis!' }));
    await screen.findByRole('alert');
    expect(screen.getByLabelText('Tema')).toHaveValue('Ciência');
    expect(api.post).toHaveBeenCalledWith('/sugestoes', { nome: 'Teste', email: 'teste@example.com', tema: 'Ciência' });
  });
});
describe('pagination', () => {
  it('uses array responses, exposed headers, page and descending order', async () => {
    const get = vi.spyOn(api, 'get').mockResolvedValue({ data: [{ id: 'a' }], headers: new AxiosHeaders({ 'x-total-pages': '2' }) });
    const { result } = renderHook(() => usePaginatedResource('/posts'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.totalPages).toBe(2);
    expect(get).toHaveBeenCalledWith('/posts', expect.objectContaining({ params: { page: 0, size: 20, order: 'desc' } }));
    act(() => result.current.setPage(1));
    await waitFor(() => expect(get).toHaveBeenLastCalledWith('/posts', expect.objectContaining({ params: { page: 1, size: 20, order: 'desc' } })));
  });
  it('reports missing CORS pagination headers instead of hiding records', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: [], headers: {} });
    const { result } = renderHook(() => usePaginatedResource('/posts'));
    await waitFor(() => expect(result.current.error).toContain('CORS'));
  });
  it('disables invalid page navigation', () => {
    const change = vi.fn();
    render(<Pagination page={0} totalPages={2} loading={false} setPage={change} />);
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    expect(change).toHaveBeenCalledWith(1);
  });
});
describe('administrator verification', () => {
  function Status() {
    const { isLoggedIn, isChecking } = useContext(AuthContext);
    return <p>{isChecking ? 'checking' : isLoggedIn ? 'admin' : 'guest'}</p>;
  }
  it('does not grant access just because a token exists', async () => {
    saveSession(`e30.${btoa(JSON.stringify({ exp: Date.now() / 1000 + 100 }))}.fake`, false);
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Forbidden'));
    render(<AuthProvider><Status /></AuthProvider>);
    await screen.findByText('guest');
  });
  it('grants panel access after the protected server check', async () => {
    saveSession(`e30.${btoa(JSON.stringify({ exp: Date.now() / 1000 + 100 }))}.fake`, false);
    vi.spyOn(api, 'get').mockResolvedValue({ data: [] });
    render(<AuthProvider><Status /></AuthProvider>);
    await screen.findByText('admin');
  });
});
