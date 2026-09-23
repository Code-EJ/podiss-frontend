import { Button } from './ui/button';
/** Keyboard-accessible server-side pagination. @author oEnzoRibas */
export function Pagination({
  page,
  totalPages,
  loading,
  setPage,
}: {
  page: number;
  totalPages: number;
  loading: boolean;
  setPage: (page: number) => void;
}) {
  if (totalPages < 2) return null;
  return (
    <nav
      aria-label="Paginação"
      className="flex flex-wrap justify-center items-center gap-3 my-6"
    >
      <Button variant="secondary"
        className="border rounded px-3 py-2 disabled:opacity-50"
        disabled={loading || page === 0}
        onClick={() => setPage(page - 1)}
      >
        Anterior
      </Button>
      <span aria-live="polite">
        Página {page + 1} de {totalPages}
      </span>
      <Button variant="secondary"
        className="border rounded px-3 py-2 disabled:opacity-50"
        disabled={loading || page >= totalPages - 1}
        onClick={() => setPage(page + 1)}
      >
        Próxima
      </Button>
    </nav>
  );
}
