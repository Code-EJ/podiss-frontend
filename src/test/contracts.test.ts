import { describe, expect, it, vi } from 'vitest';
import { AxiosError, AxiosHeaders, type AxiosAdapter } from 'axios';
import api, { errorMessage } from '../api';
import { expirationTime, saveSession, readToken, clearSession } from '../auth-session';
import { parseTags, postForm } from '../domain/post';

/** Pure boundary tests and intercepted HTTP; no remote requests. @author oEnzoRibas */
const token = () => `eyJhbGciOiJIUzUxMiJ9.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 600 }))}.signature`;
describe('session boundaries', () => {
  it('rejects malformed and expired tokens', () => {
    expect(expirationTime('garbage')).toBe(0);
    expect(() => saveSession('garbage', true)).toThrow();
    expect(readToken()).toBeNull();
  });
  it('uses session storage unless remember is selected', () => {
    saveSession(token(), false);
    expect(localStorage.getItem('podiss.auth.token')).toBeNull();
    expect(readToken()).toBe(token());
    clearSession(); expect(readToken()).toBeNull();
  });
  it('remembers only the token and expires it', () => {
    const value = token(); saveSession(value, true);
    expect(localStorage.getItem('podiss.auth.token')).toBe(value);
    vi.spyOn(Date, 'now').mockReturnValue(expirationTime(value) + 1);
    expect(readToken()).toBeNull();
  });
});
describe('post wire format', () => {
  it('clears empty tags without a blank element', () => { expect(parseTags(' , ')).toEqual([]); });
  it('normalizes and deduplicates tags', () => { expect(parseTags(' A, B,A ')).toEqual(['A', 'B']); });
  it('uses repeated multipart fields and omits empty tags/image', () => {
    expect(postForm(' title ', ' body ', ['A', 'B']).getAll('tags')).toEqual(['A', 'B']);
    const empty = postForm('x', 'y', []);
    expect(empty.has('tags')).toBe(false); expect(empty.has('image')).toBe(false);
  });
  it('checks image size and type before uploading', () => {
    expect(() => postForm('x', 'y', [], new File(['x'], 'a.svg', { type: 'image/svg+xml' }))).toThrow();
    expect(() => postForm('x', 'y', [], new File([new Uint8Array(5242881)], 'a.png', { type: 'image/png' }))).toThrow();
    expect(postForm('x', 'y', [], new File(['png'], 'a.png', { type: 'image/png' })).has('image')).toBe(true);
  });
});
describe('transport', () => {
  function adapter(): AxiosAdapter {
    return async config => ({ data: config.headers.Authorization ?? null, status: 200, statusText: 'OK',
      headers: new AxiosHeaders(), config });
  }
  it.each(['/posts', '/episodes'])('does not attach tokens on public GET %s', async path => {
    saveSession(token(), true);
    expect((await api.get(path, { adapter: adapter() })).data).toBeNull();
  });
  it.each(['/api/auth/login', '/contatos', '/sugestoes'])('does not attach tokens on public POST %s', async path => {
    saveSession(token(), true);
    expect((await api.post(path, {}, { adapter: adapter() })).data).toBeNull();
  });
  it('attaches tokens to protected requests', async () => {
    const value = token(); saveSession(value, false);
    expect((await api.get('/contatos', { adapter: adapter() })).data).toBe(`Bearer ${value}`);
  });
  it('rejects absolute URLs to prevent credential leakage', async () => {
    await expect(api.get('https://example.com', { adapter: adapter() })).rejects.toThrow();
    await expect(api.get('//example.com', { adapter: adapter() })).rejects.toThrow();
    await expect(api.get('/\\example.com', { adapter: adapter() })).rejects.toThrow();
  });
  it('clears session on authenticated 401', async () => {
    saveSession(token(), false);
    const failing: AxiosAdapter = async config => { throw new AxiosError('Unauthorized', '401', config, undefined,
      { data: {}, status: 401, statusText: 'Unauthorized', headers: new AxiosHeaders(), config }); };
    await expect(api.get('/contatos', { adapter: failing })).rejects.toThrow();
    expect(readToken()).toBeNull();
  });
  it('does not expose server diagnostics', () => {
    const failure = new AxiosError('internal secret');
    expect(errorMessage(failure)).not.toContain('internal secret');
  });
});
