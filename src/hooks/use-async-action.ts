import { useEffect, useRef, useState } from 'react';
import { errorMessage } from '../api';
import { notifications } from '../feedback/notifications';
import { activity } from '../feedback/activity';

/** Serializes a user mutation, provides feedback and preserves the caller's data on failure. @author oEnzoRibas */
export function useAsyncAction() {
  const lock = useRef(false);
  const mounted = useRef(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function run<T>(operation: () => Promise<T>, messages: { loading: string; success: string }): Promise<{ ok: true; value: T } | { ok: false }> {
    if (lock.current) return { ok: false };
    lock.current = true; setBusy(true); setError(null);
    const id = notifications.show('loading', messages.loading);
    const finish = activity.begin();
    try {
      const value = await operation();
      notifications.update(id, 'success', messages.success);
      return { ok: true, value };
    } catch (failure) {
      const message = errorMessage(failure);
      if (mounted.current) setError(message);
      notifications.update(id, 'error', message);
      return { ok: false };
    } finally {
      finish(); lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  return { busy, error, run };
}
