import { siteContent } from '../content/site-content';

/** Uses the same locale everywhere and handles incomplete data without rendering Invalid Date. @author oEnzoRibas */
export function formatDate(value: string, long = false): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data indisponível';
  return date.toLocaleDateString(siteContent.locale, long ? { year: 'numeric', month: 'long', day: 'numeric' } : undefined);
}
