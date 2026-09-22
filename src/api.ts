import axios from 'axios';
import { API_URL } from './config';
import { clearSession, readToken } from './auth-session';
import type { ApiProblem } from './types/api';

/** Bounded transport; public requests do not inherit stored credentials. @author oEnzoRibas */
const api = axios.create({ baseURL: API_URL, timeout: 15000 });
api.interceptors.request.use(config => {
  const path = config.url ?? '';
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\'))
    throw new Error('Use um caminho relativo da API.');
  const method = (config.method ?? 'get').toLowerCase();
  const isPublic = (method === 'get' && /^\/(posts|episodes)(\/|$)/.test(path))
    || (method === 'post' && ['/api/auth/login', '/contatos', '/sugestoes'].includes(path));
  const token = readToken();
  if (!isPublic && token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(response => response, (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    const sent = error.config?.headers?.Authorization;
    if (sent && sent === `Bearer ${readToken()}`) clearSession();
  }
  return Promise.reject(error);
});
/**
 * Produces user-facing text without logging request headers, credentials or server diagnostics.
 * @param error - A transport or local validation failure.
 * @returns Portuguese feedback; known 5xx failures never expose their detail.
 * @author oEnzoRibas
 */
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiProblem>(error)) {
    if (error.response?.status === 401) return 'Sessão expirada ou credenciais inválidas. Entre novamente.';
    if (error.response?.status === 403) return 'Esta operação exige acesso de administrador.';
    if (error.response?.status === 429) return 'Muitas tentativas. Aguarde antes de enviar novamente.';
    if (error.response && error.response.status >= 500) return 'Serviço indisponível. Tente novamente mais tarde.';
    if (error.response?.data?.detail) return error.response.data.detail;
    if (!error.response) return 'Não foi possível conectar à API. Confira sua conexão e tente novamente.';
  }
  return error instanceof Error ? error.message : 'Não foi possível concluir a operação.';
}
export default api;
