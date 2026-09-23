/** Persistent inline error; the global toast is supplemental, never the sole recovery feedback. @author oEnzoRibas */
export function Alert({ message }: { message: string | null | undefined }) {
  return message ? <p role="alert" className="my-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{message}</p> : null;
}
