import type { ReactNode } from 'react';
import { Button } from '../ui/button';
/** Editorial submit wrapper around the shared action state. @author oEnzoRibas */
export default function FormButton({ children, disabled, loading }: { children: ReactNode; disabled?: boolean; loading?: boolean }) {
  return <Button type="submit" disabled={disabled} loading={loading} loadingText="Enviando..." className="w-full">{children}</Button>;
}
