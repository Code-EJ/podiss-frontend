# Frontend baseline — etapa 01

Data: 2026-09-21. Créditos: oEnzoRibas. Leitura antes das mudanças; branch main inicialmente limpa. Não houve acesso à Hostinger.

## Arquitetura e configuração

SPA React 18.3.1, TypeScript, Vite 5.3.5, Tailwind 3; BrowserRouter, layouts público/admin, estado local e AuthContext. Sem SSR real apesar de Next instalado. Chamadas fetch/Axios duplicadas; database.ts é configuração de URL, não banco. .env privado existente preservado; exemplo aponta https://localhost:8080, incompatível com Docker backend HTTP 18080. Sem testes ou CI próprios. Sem Docker frontend, o artefato publicado é dist.

## Problemas por prioridade

| Prioridade | Evidência | Solução planejada |
| --- | --- | --- |
| P0 | build falha TS6133 em create-post-page; lint falha em três any | Corrigir tipos e validar pipeline |
| P1 | AuthContext considera qualquer token como login; sem expiração/401 central | Sessão central e verificação ADMIN no servidor |
| P1 | tags multipart JSON fatiado; tags vazias no PUT viram [""] | Array multipart e normalização explícita |
| P1 | listas revertem apenas primeira página asc; destaques podem ser antigos | Paginação por headers e order=desc no servidor |
| P1 | erros de listas confundidos com vazio; detalhes de vídeo ignoram status | Estados loading/error/empty distintos |
| P1 | console registra erros Axios e sugestões com dados pessoais | Mensagens sanitizadas, sem logs de payload/token |
| P2 | imagens requisitadas mesmo sem hasImage | Respeitar resposta do backend |
| P2 | parser YouTube por includes aceita domínios semelhantes | Usar youtubeId retornado e validação estrita |
| P2 | botão lembrar não funciona, labels sem associação, menus por li clicável | Sessão opcional persistente e acessibilidade |
| P2 | classe admin duplicada não usada; dependências Next/heroicons sem imports | Remover duplicação e dependências comprovadamente ociosas |

## Dependências

npm audit inicial: 26 entradas (2 critical, 16 high, 6 moderate, 2 low). Isso é inventário de pacotes, não 26 explorações demonstradas. Axios 1.7.4, Next 14.2.7 e Vite 5.3.5 merecem correção. Vite vulnerável em Windows sob condições específicas: [advisory do mantenedor](https://github.com/vitejs/vite/security/advisories/GHSA-fx2h-pf6j-xcff). Dev server não deve ser público. Remover Next, não migrar SPA para Next. Registrar resultado final do audit; não executar audit fix --force indiscriminadamente.

## Inventário de nomes e impacto

| Nome atual | Proposta | Classificação |
| --- | --- | --- |
| Mensagem, mensagens, mensagem (variáveis locais) | ContactMessage, messages, message | TS_ONLY (equivalente a JAVA_ONLY no backend) |
| Sugestao, sugestoes, sugestao (variáveis locais) | TopicSuggestion, suggestions, suggestion | TS_ONLY |
| mensage/setMensage, evento, ButtomForm | message/setMessage, event, FormButton | TS_ONLY |
| mineiroTooltip/MineiroTooltip | regional-expression-tooltip/RegionalExpressionTooltip | TS_ONLY |
| user-initial-petry/UserInitialPetry | landing-page/LandingPage | TS_ONLY |
| epidode-list-page-admin, LoginAdminPage, MainApp | episode-list-page, login-page, app | TS_ONLY |
| database.ts | config.ts | TS_ONLY; VITE_API_URL preservada |
| /home/sobre-nos, /admin/sugestoes-admin, /admin/mensagens-admin | rotas inglesas com redirects legados | API_IMPACT (URLs do navegador) |
| nome, assunto, mensagem, tema em JSON; /contatos, /sugestoes | preservar no boundary HTTP | API_IMPACT; não traduzir contrato backend |
| VITE_API_URL, porta 5173 | documentar/injetar explicitamente | CONFIGURATION_IMPACT |
| tabelas/colunas | frontend não acessa MariaDB | DATABASE_IMPACT: nenhuma mudança |

Conteúdo editorial, títulos, expressões mineiras, nomes próprios e textos das páginas permanecem em português. Mensagens de erro novas também em português. Não reescrever biografia, contatos fictícios ou saudação editorial sem decisão do responsável.

## Contratos e riscos

Post: title/description/tags string na resposta; tags array no PUT e campos multipart no POST. Imagem separada, UUID. Episode: GET por youtubeId, DELETE por UUID. Contacts/suggestions: POST público, GET ADMIN. Login público, register ADMIN; JWT não carrega role, autorização precisa consultar operação protegida, nunca inferir pelo payload.

Banco pertence ao backend. Não há Flyway/migrations no frontend. Publicação exige HTTPS, API real acessível pelo navegador, CORS no backend e fallback de SPA; public_html não executa Java. Sem teste de produção nesta etapa.

## Plano das etapas 02–10

02 nomenclatura; 03 contratos tipados; 04 fluxos de leitura/escrita; 05 ADRs; 06 tutorial/dev/deploy; 07 segurança/dependências; 08 TSDoc; 09 testes de contrato/UI/integração; 10 auditoria final e commits. Etapas adaptadas à SPA, sem inventar JPA, Javadoc ou migrations de frontend. Testar localmente, sem deploy/push.
