import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import App from '../app';
import api from '../api';
import { AuthContext } from '../auth-context';
import { SiteNavbar } from '../components/navigation/site-navbar';
import { adminNavigation, publicNavigation } from '../navigation/navigation-items';
import { adminReturnPath, routes } from '../navigation/routes';
import { formatDate } from '../domain/display';
import { youtubeEmbedUrl, youtubeThumbnailUrl } from '../domain/youtube';
import { apiPaths, postImageUrl } from '../services/api-paths';

/** Global chrome and configuration regression tests; no live services or real credentials. @author oEnzoRibas */
describe('shared site layout', () => {
  const visit = (path: string, authenticated = false) => {
    window.history.replaceState({}, '', path);
    vi.spyOn(api, 'get').mockImplementation(async url => ({
      data: url === '/posts/test-post' ? { id: 'test-post', title: 'Post fixture', description: 'Body',
        tags: 'test', createdAt: '2026-09-22T12:00:00Z', hasImage: false, imageUrl: null }
        : url === '/episodes/abcdefghijk' ? { title: 'Episode fixture', description: 'Body', videoUrl: '' } : [],
      headers: { 'x-total-pages': '0' },
    }));
    render(<AuthContext.Provider value={{ isLoggedIn: authenticated, isChecking: false, token: null,
      login: vi.fn(), logout: vi.fn() }}><App /></AuthContext.Provider>);
  };
  it.each(['/', '/home/posts', '/home/episodes', '/home/about', '/admin/login',
    '/posts/test-post', '/video/abcdefghijk', '/missing', '/admin', '/admin/messages', '/admin/missing'])(
    'renders exactly one global navbar, main and footer on %s', async path => {
    visit(path, path.startsWith('/admin') && path !== '/admin/login');
    expect(screen.getAllByRole('navigation', { name: 'Navegação principal' })).toHaveLength(1);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
    for (const item of publicNavigation)
      expect(screen.getByRole('link', { name: item.label })).toHaveAttribute('href', item.to);
    if (path === '/posts/test-post') {
      await screen.findByRole('heading', { name: 'Post fixture' });
      expect(screen.getByRole('link', { name: 'Nossos Causos' })).toHaveAttribute('aria-current', 'page');
    }
    if (path === '/video/abcdefghijk') {
      await screen.findByRole('heading', { name: 'Episode fixture' });
      expect(screen.getByRole('link', { name: 'Os Episódiu' })).toHaveAttribute('aria-current', 'page');
    }
    await waitFor(() => expect(screen.queryByText('Carregando...')).not.toBeInTheDocument());
  });
  it('exposes only the guest action without rendering administrative links', () => {
    visit('/admin/login');
    expect(screen.getByRole('link', { name: 'Entrá' })).toHaveAttribute('href', routes.login);
    expect(screen.queryByRole('navigation', { name: 'Navegação administrativa' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sair' })).not.toBeInTheDocument();
  });
  it('uses separate admin links with URL-driven active state', async () => {
    visit('/admin/messages', true);
    const admin = screen.getByRole('navigation', { name: 'Navegação administrativa' });
    for (const item of adminNavigation)
      expect(within(admin).getByRole('link', { name: item.label })).toHaveAttribute('href', item.to);
    expect(within(admin).getByRole('link', { name: 'Mensagens Recebidas' })).toHaveAttribute('aria-current', 'page');
    expect(within(admin).getByRole('link', { name: 'Listar Post' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Painel' })).toHaveAttribute('href', routes.admin);
    expect(screen.queryByRole('link', { name: 'Entrá' })).not.toBeInTheDocument();
    await screen.findByText('Nenhuma mensagem encontrada.');
  });
  it('keeps the navigation when episode validation fails', async () => {
    visit('/video/invalid');
    expect(await screen.findByRole('alert')).toHaveTextContent('Episódio inválido.');
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument();
  });
});

describe('responsive menu and session actions', () => {
  function NavbarSession({ checking = false }: { checking?: boolean }) {
    const [loggedIn, setLoggedIn] = useState(true);
    return <MemoryRouter><AuthContext.Provider value={{ isLoggedIn: loggedIn, isChecking: checking, token: null,
      login: vi.fn(), logout: () => setLoggedIn(false) }}><SiteNavbar /></AuthContext.Provider></MemoryRouter>;
  }
  it('closes on Escape and restores focus to the toggle', () => {
    render(<NavbarSession />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const toggle = screen.getByRole('button', { name: 'Fechar menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(screen.getByRole('navigation'), { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });
  it('closes after following a link and has no duplicated responsive links', () => {
    render(<NavbarSession />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(screen.getAllByRole('link', { name: 'Nossos Causos' })).toHaveLength(1);
    fireEvent.click(screen.getByRole('link', { name: 'Nossos Causos' }));
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
  });
  it('changes session controls after logout', () => {
    render(<NavbarSession />);
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
    expect(screen.getByRole('link', { name: 'Entrá' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Painel' })).not.toBeInTheDocument();
  });
  it('does not show panel actions before verification completes', () => {
    render(<NavbarSession checking />);
    expect(screen.getByRole('status')).toHaveTextContent('Verificando sessão...');
    expect(screen.queryByRole('link', { name: 'Painel' })).not.toBeInTheDocument();
  });
});

describe('centralized URL and display policies', () => {
  it('preserves approved labels exactly', () => {
    expect(publicNavigation.map(item => item.label)).toEqual([
      'Onditudocomeçô', 'Nossos Causos', 'Os Episódiu', 'Um tiquin da gente',
    ]);
  });
  it('only returns known administrative destinations after login', () => {
    expect(adminReturnPath(routes.messages)).toBe(routes.messages);
    for (const path of ['https://example.com', '/admin\\example.com', '/admin/unknown', null])
      expect(adminReturnPath(path)).toBe(routes.admin);
  });
  it('encodes resource identifiers without changing Portuguese wire endpoints', () => {
    expect(routes.post('a/b')).toBe('/posts/a%2Fb');
    expect(apiPaths.contacts).toBe('/contatos');
    expect(apiPaths.suggestions).toBe('/sugestoes');
    expect(apiPaths.postImage('a/b')).toBe('/posts/a%2Fb/image');
    expect(postImageUrl('a/b')).toBe('http://localhost:18080/posts/image/a%2Fb');
  });
  it('validates provider identifiers before building external media URLs', () => {
    expect(youtubeEmbedUrl('abcdefghijk')).toBe('https://www.youtube.com/embed/abcdefghijk');
    expect(youtubeThumbnailUrl('abcdefghijk')).toContain('/vi/abcdefghijk/hqdefault.jpg');
    expect(() => youtubeEmbedUrl('../invalid')).toThrow('Episódio inválido.');
  });
  it('uses Brazilian date formatting with an invalid-data fallback', () => {
    expect(formatDate('2026-09-22T12:00:00Z')).toBe('22/09/2026');
    expect(formatDate('invalid')).toBe('Data indisponível');
  });
});
