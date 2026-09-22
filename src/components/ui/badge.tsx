import type { ReactNode } from 'react';

/** Compact metadata, allowed to wrap instead of forcing cards wider than their grid. @author oEnzoRibas */
export function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex max-w-full break-words rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">{children}</span>;
}
