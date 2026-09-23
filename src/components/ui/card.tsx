import type { HTMLAttributes } from 'react';

/** Neutral surface preserving the site's white, gray and red visual system. @author oEnzoRibas */
export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ${className}`} />;
}
