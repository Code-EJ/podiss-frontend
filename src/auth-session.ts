/** Expiry decoding is UX only; signature and role checks belong to the server. @author oEnzoRibas */
const KEY = 'podiss.auth.token';
export const AUTH_CHANGED = 'podiss:auth-changed';
/**
 * Reads the untrusted exp claim for UI scheduling only; does not verify a signature.
 * @param token - Compact JWT supplied by the API.
 * @returns Expiration in epoch milliseconds, or zero for malformed claims.
 * @author oEnzoRibas
 */
export function expirationTime(token: string): number {
  try {
    const payload: unknown = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof payload !== 'object' || payload === null || !('exp' in payload)
      || typeof payload.exp !== 'number' || !Number.isFinite(payload.exp)) return 0;
    return payload.exp * 1000;
  } catch { return 0; }
}
export function clearSession(): void {
  localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); localStorage.removeItem('token');
  window.dispatchEvent(new Event(AUTH_CHANGED));
}
export function readToken(): string | null {
  const token = sessionStorage.getItem(KEY) ?? localStorage.getItem(KEY);
  return token && expirationTime(token) > Date.now() ? token : null;
}
/**
 * Replaces the current browser session and notifies the provider.
 * Call only after successful server-side administrator verification.
 * @param token - Unexpired JWT, never a password.
 * @param remember - Persist across browser sessions only when explicitly selected.
 * @throws Error when the token is malformed or already expired.
 * @author oEnzoRibas
 */
export function saveSession(token: string, remember: boolean): void {
  if (expirationTime(token) <= Date.now()) throw new Error('Token inválido ou expirado.');
  clearSession();
  (remember ? localStorage : sessionStorage).setItem(KEY, token);
  window.dispatchEvent(new Event(AUTH_CHANGED));
}
