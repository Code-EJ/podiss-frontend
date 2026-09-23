# Relatório de implementação — etapas 02 a 09

Créditos: oEnzoRibas. Escopo local; branch dev mantida. O baseline começou em main; durante as leituras houve checkout externo para dev, confirmado pelo reflog. A versão 1.0.0 de dev foi preservada, sem forçar 1.0.1 de main.

## 02 — Nomenclatura

Arquivos TS/TSX passam a kebab-case e símbolos de domínio a inglês. Exemplos: MainApp→app; database→config; LoginAdminPage→login-page/AdminLoginPage; epidode-list-page-admin→episode-list-page; admin-episode-page→create-episode-page; user-initial-petry→landing-page; buttom-form→form-button; mineiroTooltip→regional-expression-tooltip; high-light-card→highlight-card; side-bar-admin→admin-sidebar. Variáveis mensage/evento/mensagens/sugestoes passaram a message/event/messages/suggestions.

Classificação TS_ONLY equivale a JAVA_ONLY nesta SPA. Rotas /home/about, /admin/messages e /admin/suggestions são API_IMPACT; aliases antigos redirecionam sem quebrar bookmarks. JSON nome/assunto/mensagem/tema e endpoints /contatos e /sugestoes permanecem por compatibilidade API_IMPACT. VITE_API_URL e arquivos de ambiente são CONFIGURATION_IMPACT. Nenhuma mudança DATABASE_IMPACT.

Nomes próprios, conteúdo editorial, âncoras de conteúdo e textos das páginas não foram traduzidos. A padronização não exige remover palavras portuguesas do contrato externo.

## 03 — Contratos

Tipos centralizados para posts, episódios, contatos e sugestões. Cliente Axios único com timeout, autenticação seletiva e erros sem logs de payload/token. Removedor de duplicação: home-page-admin.tsx não era importado e continha endpoint localhost hardcoded; histórico Git preserva arquivo.

## 04 — Funcionalidades

Paginação por headers, ordem desc no servidor, loading/error/empty separados; detalhes com cancelamento de requisições; imagens condicionadas a hasImage. POST de post usa tags multipart repetidas; PUT suporta limpar categorias com []. Editor substitui/remove imagem em rotas próprias. Formulários públicos preservam dados em falha e impedem envio durante requisição. Episódios usam youtubeId, UUID apenas para exclusão; validação local de 11 caracteres impede iframe inválido.

Login valida ADMIN no servidor, remember funciona somente para token, expiração/401/logout limpam sessão. Links antigos têm aliases e rotas desconhecidas mostram saída recuperável. Labels associados e nomes acessíveis adicionados a controles; não é certificação completa de acessibilidade.

## 05–06 — Decisões e operação

ADRs 0002/0003 registram contratos, limites de sessão, dependências e publicação. Tutoriais documentam PowerShell versus Git Bash, frontend .env.development versus backend .env.dev, bootstrap ADMIN, SELECT no MariaDB local, testes, build estático, backup e rollback. Pipeline apenas verifica; nenhuma credencial/serviço remoto foi utilizado.

## 07 — Dependências e segurança

Next e heroicons removidos por ausência de uso. Atualizados Axios, Vite, TypeScript e tooling compatível; React 18/Tailwind 3 preservados. Lockfile atualizado e CI usa npm ci. Baseline npm audit: 26 entradas (2 críticas/16 altas/6 moderadas/2 baixas); revisão reduziu a duas moderadas da cadeia React Router. As duas não são exploração demonstrada: manter rastreamento, não omitir.

React Router 6 permanece por compatibilidade. Advisory de open redirect exige destino confiável; login restringe destino a rotas /admin com segmentos alfabéticos/hífens. Segundo advisory refere desserialização SSR, que a SPA não usa. Migrar para versão corrigida da linha 7 exige revisão e regressão própria. ESLint 8 está depreciado: migração para configuração flat é dívida separada, sem lint quebrado.

Fontes primárias consultadas: [Vite advisory](https://github.com/vitejs/vite/security/advisories/GHSA-fx2h-pf6j-xcff), [requisitos Vite](https://vite.dev/guide/), [React Router redirect](https://github.com/remix-run/react-router/security/advisories/GHSA-wrjc-x8rr-h8h6), [React Router SSR](https://github.com/remix-run/react-router/security/advisories/GHSA-337j-9hxr-rhxg). Reavaliar npm audit em cada release.

## 08 — Documentação no código

TSDoc com @author oEnzoRibas nos componentes, hooks e módulos de contrato/sessão, descrevendo finalidade e limitações. Helpers críticos documentam parâmetros, retorno e erros. Não foram criadas classes artificiais em React funcional. Créditos acrescentados sem remover titularidade/licença da Code Soluções em Tecnologia Júnior. Esta documentação é inline; não foi configurado gerador HTML de API.

## 09 — Testes

Vitest/jsdom e Testing Library cobrem contratos, forms, sessão, headers, paginação e rotas. Teste opt-in Node usa exclusivamente localhost:18080 e backend/.env.dev privado; não imprime segredo. Exercita login, acesso protegido, contatos/sugestões, CORS, post/tags, binário de imagem e cleanup. Cria contato/sugestão sintéticos persistentes por falta de DELETE; remove apenas seu post temporário.

Smoke de navegador local verificou navegação pública e tela de login. Não equivale a teste E2E integral de todas as ações ou dispositivos. Resultado final e limites ficam no relatório 10.
