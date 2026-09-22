import type { ReactNode } from 'react';

/** Consistent content width and spacing without adding another main landmark. @author oEnzoRibas */
export function PageSection({ title, description, children }: { title?: string; description?: string; children: ReactNode }) {
  return <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
    {title && <header className="space-y-2"><h1 className="break-words text-3xl font-bold text-zinc-800 sm:text-4xl">{title}</h1>
      {description && <p className="max-w-2xl text-gray-600">{description}</p>}</header>}
    {children}
  </section>;
}
