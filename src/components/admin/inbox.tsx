import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import { formatDate } from '../../domain/display';
import { PageSection } from '../ui/page-section';
import { CollectionState } from '../ui/collection-state';
import { AnimatedGrid } from '../ui/animated-grid';
import { Card } from '../ui/card';
import { Pagination } from '../pagination';

interface InboxProps<T> { path: string; title: string; empty: string; fields: readonly { key: keyof T; label: string }[] }
/** Typed inbox presentation shared by contacts and suggestions; long messages wrap on narrow screens. @author oEnzoRibas */
export function Inbox<T extends { id: string; createdAt: string }>({ path, title, empty, fields }: InboxProps<T>) {
  const result = usePaginatedResource<T>(path);
  return <PageSection title={title}>
    <CollectionState {...result} count={result.items.length} empty={empty} />
    <Pagination {...result} />
    <AnimatedGrid items={result.items}>{item => <Card className="h-full p-5">
      <p className="mb-4 text-xs text-gray-500">{formatDate(item.createdAt)}</p>
      <dl className="space-y-4">{fields.map(field => <div key={String(field.key)}>
        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{field.label}</dt>
        <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-800">{String(item[field.key] ?? '')}</dd>
      </div>)}</dl>
    </Card>}</AnimatedGrid>
  </PageSection>;
}
