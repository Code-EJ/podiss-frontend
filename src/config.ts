/** Public build-time configuration, never database credentials. @author oEnzoRibas */
const value = import.meta.env.VITE_API_URL?.trim();
if (!value)
  throw new Error("Configure VITE_API_URL antes de iniciar ou compilar.");
const url = new URL(value);
if (
  !["http:", "https:"].includes(url.protocol) ||
  url.username ||
  url.password ||
  url.search ||
  url.hash
)
  throw new Error(
    "VITE_API_URL deve ser HTTP(S), sem credenciais, query ou fragmento.",
  );
export const API_URL = value.replace(/\/+$/, "");
