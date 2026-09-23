import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import api from '../api';
import { contentService, savePost } from '../services/content-service';
import { postImageRevisions } from '../services/post-image-revisions';
import { PostEditor } from '../components/admin/post-editor';
import { PostCard } from '../components/content/post-card';
import type { Post } from '../types/api';

const post: Post = { id: 'photo-update', title: 'Post', description: 'Descrição', tags: '',
  createdAt: '2026-09-22T12:00:00Z', hasImage: true, imageUrl: null };
const file = () => new File(['new-image'], 'new.png', { type: 'image/png' });
const data = { title: 'Post', description: 'Descrição', tags: [] };
const response = { data: post } as Awaited<ReturnType<typeof contentService.updatePost>>;

/** Regression coverage for selected-file submission and stale mounted images. @author oEnzoRibas */
describe('post image updates', () => {
  it('uploads the selected image when Atualizar is clicked and waits for both requests', async () => {
    const update = vi.spyOn(contentService, 'updatePost').mockResolvedValue(response);
    const replace = vi.spyOn(contentService, 'replaceImage').mockResolvedValue(response);
    const saved = vi.fn(), image = file();
    render(<PostEditor post={post} open onClose={vi.fn()} onSaved={saved} onImageChanged={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Nova imagem do post'), { target: { files: [image] } });
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }));
    await waitFor(() => expect(saved).toHaveBeenCalledOnce());
    expect(update).toHaveBeenCalledWith(post.id, data);
    expect(replace).toHaveBeenCalledWith(post.id, image);
    expect(update.mock.invocationCallOrder[0]).toBeLessThan(replace.mock.invocationCallOrder[0]);
  });
  it('does not upload an image when only text is edited', async () => {
    vi.spyOn(contentService, 'updatePost').mockResolvedValue(response);
    const replace = vi.spyOn(contentService, 'replaceImage').mockResolvedValue(response);
    await savePost(post.id, data);
    expect(replace).not.toHaveBeenCalled();
  });
  it('validates the selected image before writing text', async () => {
    const update = vi.spyOn(contentService, 'updatePost').mockResolvedValue(response);
    await expect(savePost(post.id, data, new File(['bad'], 'bad.txt', { type: 'text/plain' }))).rejects.toThrow('Use imagem');
    expect(update).not.toHaveBeenCalled();
  });
  it('keeps the dialog and selection after a partial failure, without reporting success', async () => {
    vi.spyOn(contentService, 'updatePost').mockResolvedValue(response);
    vi.spyOn(contentService, 'replaceImage').mockRejectedValue(new Error('Network'));
    const saved = vi.fn(), image = file();
    render(<PostEditor post={post} open onClose={vi.fn()} onSaved={saved} onImageChanged={vi.fn()} />);
    const input = screen.getByLabelText('Nova imagem do post');
    fireEvent.change(input, { target: { files: [image] } });
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Texto atualizado'));
    expect(saved).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect((input as HTMLInputElement).files?.[0]).toBe(image);
  });
  it('changes the mounted image URL only after the upload succeeds', async () => {
    const put = vi.spyOn(api, 'put').mockResolvedValue(response);
    render(<MemoryRouter><PostCard post={post} /></MemoryRouter>);
    const original = screen.getByRole('img', { name: 'Post' }).getAttribute('src');
    await act(async () => { await contentService.replaceImage(post.id, file()); });
    const updated = screen.getByRole('img', { name: 'Post' }).getAttribute('src');
    expect(updated).not.toBe(original); expect(updated).toContain('?v=');
    expect(put).toHaveBeenCalledWith('/posts/photo-update/image', expect.any(FormData));
    expect((put.mock.calls[0][1] as FormData).get('image')).toBeInstanceOf(File);
    put.mockRejectedValue(new Error('Network'));
    await act(async () => { await expect(contentService.replaceImage(post.id, file())).rejects.toThrow(); });
    expect(screen.getByRole('img', { name: 'Post' })).toHaveAttribute('src', updated);
  });
  it('invalidates successful deletion but not a failed deletion', async () => {
    const remove = vi.spyOn(api, 'delete').mockResolvedValue(response);
    const before = postImageRevisions.get(post.id);
    await contentService.removeImage(post.id);
    const after = postImageRevisions.get(post.id);
    expect(after).toBeGreaterThan(before);
    remove.mockRejectedValue(new Error('Network'));
    await expect(contentService.removeImage(post.id)).rejects.toThrow();
    expect(postImageRevisions.get(post.id)).toBe(after);
  });
});
