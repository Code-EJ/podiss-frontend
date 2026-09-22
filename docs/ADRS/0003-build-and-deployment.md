# ADR 0003 — build reproduzível e publicação estática

Status: Accepted para build local/CI; destino remoto específico Pending Decision. Créditos: oEnzoRibas.

Manter React 18/SPA. Remover Next e heroicons, sem imports no projeto; não há servidor Next a publicar. Vite 7.3.6/plugin React 5/TypeScript 5.9+ adotados com Node >=22.12 (verificação em 24.12). Axios atualizado e Router permanece 6.30.6, com dois alertas moderados residuais; não aplicar migração major automática com audit fix --force.

package-lock versionado e npm ci; CI roda lint, testes, build e audit com limiar high. Esse limiar não significa ausência de riscos moderate. Atualizações futuras repetem toda a validação.

.env.development é configuração **pública**, versionada, apontando HTTP localhost:18080 para Docker backend. .env pessoal não foi modificado. Vite substitui VITE_* no build: nunca colocar senhas/JWT/credenciais SSH nessas variáveis. Produção exige VITE_API_URL real e HTTPS definida antes de npm run build.

Frontend publica somente dist em hospedagem estática; Java continua no runtime próprio. Não publicar Vite dev/preview como servidor de produção. Não é necessário Docker para desenvolver a SPA; Node local/CI e backend Docker são o ambiente de referência.

SPA precisa fallback de rotas no servidor. Não sobrescrever .htaccess/proxy existentes sem inventário. Publicação, DNS, certificados, cache, caminhos reais e rollback remoto precisam ser confirmados com o responsável.

Fontes: [requisitos Vite](https://vite.dev/guide/), [advisory Windows](https://github.com/vitejs/vite/security/advisories/GHSA-fx2h-pf6j-xcff), [advisory Router](https://github.com/remix-run/react-router/security/advisories/GHSA-wrjc-x8rr-h8h6).
