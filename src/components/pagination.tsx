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
      className="flex justify-center items-center gap-4 my-6"
    >
      <button
        className="border rounded px-3 py-2 disabled:opacity-50"
        disabled={loading || page === 0}
        onClick={() => setPage(page - 1)}
      >
        Anterior
      </button>
      <span aria-live="polite">
        Página {page + 1} de {totalPages}
      </span>
      <button
        className="border rounded px-3 py-2 disabled:opacity-50"
        disabled={loading || page >= totalPages - 1}
        onClick={() => setPage(page + 1)}
      >
        Próxima
      </button>
    </nav>
  );
}
