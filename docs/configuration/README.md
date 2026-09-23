# Configuração

Créditos: oEnzoRibas.

| Arquivo/variável | Finalidade | Git |
| --- | --- | --- |
| .env.example | Exemplo público de VITE_API_URL | Sim |
| .env.development | API Docker local http://localhost:18080 | Sim, sem segredos |
| .env.development.local | Override privado para npm run dev | Não |
| .env.production.local | URL HTTPS real para build de produção | Não |
| .env / .env.local | Configuração genérica legada/local | Não; existente preservada |
| backend/.env.dev | Senhas e parâmetros Docker do backend | Não; nunca copiar para a SPA |
| VITE_API_URL | Endereço HTTP(S) público do backend | Incorporado ao JavaScript |

Precedência Vite: variável já exportada no processo > .env.[mode].local > .env.[mode] > .env.local > .env. dev usa development; build usa production. Uma variável deixada no terminal prevalece até ser removida. No PowerShell: Remove-Item Env:VITE_API_URL (somente se definida); no Bash: unset VITE_API_URL.

A URL precisa ser absoluta, HTTP(S), sem credenciais, query ou fragmento. config.ts falha cedo quando falta configuração válida. Nunca colocar senha, JWT, chave privada, JDBC ou credencial VPS em VITE_*. Tudo nessa categoria pode ser lido pelo visitante.

Trocar a URL de um site publicado exige rebuild e republicação de dist; não basta enviar .env ao servidor. Reiniciar Vite após alterar arquivos locais. Dist e arquivos privados são ignorados pelo Git.

Servidor de desenvolvimento: localhost:5173, strictPort. Preview: localhost:4173. CORS é controlado pelo backend e precisa incluir a origem exata. Não publicar Vite nem liberar CORS indiscriminadamente.
