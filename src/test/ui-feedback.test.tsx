import { act, fireEvent, render, renderHook, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AxiosError, AxiosHeaders } from 'axios';
import { Button } from '../components/ui/button';
import { MediaPreview } from '../components/ui/media-preview';
import { Modal } from '../components/ui/modal';
import { FeedbackCenter } from '../components/feedback/feedback-center';
import { PostEditor } from '../components/admin/post-editor';
import { EpisodeCard } from '../components/content/episode-card';
import { PostCard } from '../components/content/post-card';
import { useAsyncAction } from '../hooks/use-async-action';
import { notifications } from '../feedback/notifications';
import { activity } from '../feedback/activity';
import { contentService } from '../services/content-service';
import api from '../api';
import type { Episode, Post } from '../types/api';

const post: Post = { id: 'test-post', title: 'Título', description: 'Descrição', tags: 'teste,teste',
  createdAt: '2026-09-22T12:00:00Z', hasImage: false, imageUrl: null };
const episode: Episode = { id: 'db-uuid', youtubeId: 'abcdefghijk', title: 'Episódio', description: 'Descrição',
  createdAt: '2026-09-22T12:00:00Z', videoUrl: '', thumbnailUrl: null };

/** Interaction tests exercise behavior without sending real data or depending on browser timing. @author oEnzoRibas */
describe('shared action feedback', () => {
  it('disables a loading button, changes its label and exposes busy state', () => {
    const click = vi.fn();
    render(<Button loading loadingText="Enviando..." onClick={click}>Enviar</Button>);
    const button = screen.getByRole('button', { name: 'Enviando...' });
    expect(button).toBeDisabled(); expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveClass('bg-amber-100'); fireEvent.click(button); expect(click).not.toHaveBeenCalled();
  });
  it('tracks concurrent activity until every operation finishes, idempotently', () => {
    const first = activity.begin(), second = activity.begin();
    expect(activity.snapshot()).toBe(2); first(); first(); expect(activity.snapshot()).toBe(1);
    second(); expect(activity.snapshot()).toBe(0);
  });
  it('updates a single toast through loading and success and permits dismissal', async () => {
    render(<FeedbackCenter />);
    let id = 0;
    act(() => { id = notifications.show('loading', 'Enviando teste'); });
    expect(screen.getByRole('status')).toHaveTextContent('Processando');
    act(() => notifications.update(id, 'success', 'Concluído'));
    expect(screen.getByRole('status')).toHaveTextContent('Sucesso');
    expect(screen.getByRole('status').parentElement).toHaveClass('bg-emerald-50');
    fireEvent.click(screen.getByRole('button', { name: 'Fechar notificação' }));
    await waitFor(() => expect(screen.queryByText('Concluído')).not.toBeInTheDocument());
  });
  it('shows an accessible red error notice with no automatic dismissal', () => {
    render(<FeedbackCenter />);
    act(() => { notifications.show('error', 'Falha de teste'); });
    expect(screen.getByRole('alert')).toHaveTextContent('Falha de teste');
    expect(screen.getByRole('alert').parentElement).toHaveClass('bg-rose-50');
  });
  it('bounds queued notices without retaining submitted payloads', () => {
    for (let i = 0; i < 8; i++) notifications.show('success', `Operação ${i}`);
    expect(notifications.snapshot()).toHaveLength(5);
  });
  it('blocks simultaneous mutations and reports completion once', async () => {
    let resolve!: () => void;
    const promise = new Promise<void>(done => { resolve = done; });
    const operation = vi.fn(() => promise);
    const { result } = renderHook(() => useAsyncAction());
    let first!: ReturnType<typeof result.current.run>;
    act(() => { first = result.current.run(operation, { loading: 'Enviando', success: 'Concluído' }); });
    await act(async () => { await result.current.run(operation, { loading: 'Duplicado', success: 'Duplicado' }); });
    expect(operation).toHaveBeenCalledTimes(1); expect(result.current.busy).toBe(true);
    await act(async () => { resolve(); await first; });
    expect(result.current.busy).toBe(false); expect(activity.snapshot()).toBe(0);
    expect(notifications.snapshot()).toEqual([expect.objectContaining({ tone: 'success', message: 'Concluído' })]);
  });
  it('cleans up activity and retains an inline error after failure', async () => {
    const { result } = renderHook(() => useAsyncAction());
    await act(async () => { await result.current.run(async () => { throw new Error('Falha de teste'); }, { loading: 'Enviando', success: 'OK' }); });
    expect(result.current.error).toBe('Falha de teste'); expect(result.current.busy).toBe(false);
    expect(activity.snapshot()).toBe(0); expect(notifications.snapshot()[0].tone).toBe('error');
  });
  it('finishes transport activity on HTTP success and failure', async () => {
    await api.get('/posts', { adapter: async config => {
      expect(activity.snapshot()).toBe(1);
      return { config, headers: new AxiosHeaders(), status: 200, statusText: 'OK', data: [] };
    } });
    expect(activity.snapshot()).toBe(0);
    await expect(api.get('/posts', { adapter: async config => { throw new AxiosError('Network', 'ERR_NETWORK', config); } })).rejects.toThrow();
    expect(activity.snapshot()).toBe(0);
  });
});

describe('media and cards', () => {
  it('uses lazy images, falls back on error and recovers for a new source', () => {
    const { rerender } = render(<MediaPreview src="/first.png" alt="Capa" />);
    expect(screen.getByRole('img', { name: 'Capa' })).toHaveAttribute('loading', 'lazy');
    fireEvent.error(screen.getByRole('img', { name: 'Capa' }));
    expect(screen.getByRole('img', { name: /prévia indisponível/ })).toBeInTheDocument();
    rerender(<MediaPreview src="/second.png" alt="Capa" />);
    expect(screen.getByRole('img', { name: 'Capa' })).toHaveAttribute('src', '/second.png');
  });
  it('does not request an absent post image or invent metadata', () => {
    const { container } = render(<MemoryRouter><PostCard post={post} /></MemoryRouter>);
    expect(container.querySelector('img')).toBeNull(); expect(screen.getAllByText('teste')).toHaveLength(1);
    expect(screen.queryByText(/Autor|curtir/i)).not.toBeInTheDocument();
  });
  it('uses a lightweight preview without mounting a player in the list', () => {
    const { container } = render(<MemoryRouter><EpisodeCard episode={episode} /></MemoryRouter>);
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.getByRole('link', { name: 'Assistir Episódio' })).toHaveAttribute('href', '/video/abcdefghijk');
  });
  it('does not link malformed provider IDs', () => {
    render(<MemoryRouter><EpisodeCard episode={{ ...episode, youtubeId: 'invalid' }} /></MemoryRouter>);
    expect(screen.getByText('Vídeo indisponível')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});

describe('modal interaction', () => {
  it('labels the dialog, responds to cancel, restores focus and body scrolling', async () => {
    const close = vi.fn();
    const trigger = document.createElement('button'); document.body.appendChild(trigger); trigger.focus();
    const { rerender, unmount } = render(<Modal open title="Confirmar" onClose={close}><p>Conteúdo</p></Modal>);
    const dialog = screen.getByRole('dialog', { name: 'Confirmar' });
    expect(dialog).toHaveAttribute('aria-modal', 'true'); expect(document.body.style.overflow).toBe('hidden');
    fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true })); expect(close).toHaveBeenCalledOnce();
    rerender(<Modal open={false} title="Confirmar" onClose={close}><p>Conteúdo</p></Modal>);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus(); expect(document.body.style.overflow).toBe('');
    unmount(); trigger.remove();
  });
  it('prevents dismissing a dialog during a mutation', () => {
    const close = vi.fn();
    render(<Modal open busy title="Processando" onClose={close}><p>Conteúdo</p></Modal>);
    const dialog = screen.getByRole('dialog');
    fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true })); fireEvent.click(dialog);
    expect(close).not.toHaveBeenCalled(); expect(screen.getByRole('button', { name: 'Fechar janela' })).toBeDisabled();
  });
  it('edits post text through the service without touching image data', async () => {
    const update = vi.spyOn(contentService, 'updatePost').mockResolvedValue({ data: post } as Awaited<ReturnType<typeof contentService.updatePost>>);
    const saved = vi.fn();
    render(<PostEditor post={post} open onClose={vi.fn()} onSaved={saved} onImageChanged={vi.fn()} />);
    const dialog = screen.getByRole('dialog', { name: 'Editar Post' });
    fireEvent.change(within(dialog).getByLabelText('Título:'), { target: { value: 'Novo título' } });
    fireEvent.change(within(dialog).getByLabelText('Tags:'), { target: { value: '' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Atualizar' }));
    await waitFor(() => expect(update).toHaveBeenCalledWith('test-post', { title: 'Novo título', description: 'Descrição', tags: [] }));
    await waitFor(() => expect(saved).toHaveBeenCalledOnce());
  });
});
