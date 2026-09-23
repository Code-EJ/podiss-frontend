import { apiPaths } from './services/api-paths';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import api from './api';
import { AuthContext } from './auth-context';
import { AUTH_CHANGED, clearSession, expirationTime, readToken, saveSession } from './auth-session';

/** Checks ADMIN using a protected read; tokens have no role claim. Never stores passwords. @author oEnzoRibas */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(readToken);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);
  const [isChecking, setChecking] = useState(Boolean(token));
  useEffect(() => {
    const sync = () => setToken(readToken());
    window.addEventListener(AUTH_CHANGED, sync); window.addEventListener('storage', sync);
    localStorage.removeItem('token');
    return () => { window.removeEventListener(AUTH_CHANGED, sync); window.removeEventListener('storage', sync); };
  }, []);
  useEffect(() => {
    if (!token) { setVerifiedToken(null); setChecking(false); return; }
    const controller = new AbortController(); setChecking(true);
    api.get(apiPaths.contacts, { params: { page: 0, size: 1 }, signal: controller.signal,
      headers: { Authorization: `Bearer ${token}` } })
      .then(() => { if (!controller.signal.aborted) setVerifiedToken(token); })
      .catch(() => { if (!controller.signal.aborted) { setVerifiedToken(null); clearSession(); } })
      .finally(() => { if (!controller.signal.aborted) setChecking(false); });
    const timer = window.setTimeout(clearSession, Math.min(Math.max(0, expirationTime(token) - Date.now()), 2147483647));
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [token]);
  const login = useCallback(async (candidate: string, remember = false) => {
    await api.get(apiPaths.contacts, { params: { page: 0, size: 1 }, headers: { Authorization: `Bearer ${candidate}` } });
    saveSession(candidate, remember); setVerifiedToken(candidate);
  }, []);
  return <AuthContext.Provider value={{ token, isChecking, isLoggedIn: Boolean(token && verifiedToken === token),
    login, logout: clearSession }}>{children}</AuthContext.Provider>;
}
