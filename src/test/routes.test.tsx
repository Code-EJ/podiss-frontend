import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../app';
import { AuthContext } from '../auth-context';
import api from '../api';

/** Regression coverage for bookmarked routes and authentication guards. @author oEnzoRibas */
describe('application routes', () => {
  function visit(path: string, authenticated = false) {
    window.history.replaceState({}, '', path);
    vi.spyOn(api, 'get').mockResolvedValue({ data: [], headers: { 'x-total-pages': '0' } });
    return render(<AuthContext.Provider value={{ isLoggedIn: authenticated, isChecking: false,
      token: null, login: vi.fn(), logout: vi.fn() }}><App /></AuthContext.Provider>);
  }
  it('redirects unauthenticated administrator routes to login', async () => {
    visit('/admin/create-post');
    await screen.findByLabelText('Usuário');
    expect(window.location.pathname).toBe('/admin/login');
  });
  it('preserves the old public about bookmark', async () => {
    visit('/home/sobre-nos');
    await waitFor(() => expect(window.location.pathname).toBe('/home/about'));
  });
  it.each([
    ['/admin/mensagens-admin', '/admin/messages'],
    ['/admin/sugestoes-admin', '/admin/suggestions'],
  ])('preserves administrator bookmark %s', async (oldPath, newPath) => {
    visit(oldPath, true);
    await waitFor(() => expect(window.location.pathname).toBe(newPath));
  });
  it('renders a recoverable not-found page', () => {
    visit('/missing-page');
    expect(screen.getByText(/Página não encontrada/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voltar ao início' })).toHaveAttribute('href', '/');
  });
});
