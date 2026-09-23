# Manutenção dos módulos do frontend

Créditos: oEnzoRibas. Decisão: [ADR 0004](../ADRS/0004-shared-navigation.md).

## Onde mudar cada coisa

| Necessidade | Arquivo/módulo |
| --- | --- |
| Nome/ordem de link público ou administrativo | src/navigation/navigation-items.ts |
| URL de navegação, alias, destino pós-login permitido | src/navigation/routes.ts |
| Associar página à URL/RequireAuth | src/app.tsx |
| Logo, rodapé, organização, locale, título genérico do painel | src/content/site-content.ts |
| Layout global, navbar, main e rodapé | src/layouts/site-layout.tsx |
| Comportamento mobile/Escape | src/components/navigation/site-navbar.tsx |
| Link ativo, grupos de detalhes | src/components/navigation/navigation-links.tsx |
| Entrá/Painel/Sair | src/components/navigation/session-actions.tsx |
| Sidebar específica do painel | src/components/admin/admin-sidebar.tsx |
| Origem da API | VITE_API_URL e src/config.ts |
| Endpoints e imagem HTTP | src/services/api-paths.ts |
| Transporte, timeout, tratamento 401 | src/api.ts |
| Estado/verificação de sessão | src/auth-provider.tsx, src/auth-session.ts |
| Regras reutilizadas | src/domain/post.ts, display.ts, youtube.ts |

## Adicionar uma página

Definir URL em routes.ts, associar componente em app.tsx e, se houver item de menu, incluir em navigation-items.ts. Para rota administrativa, colocá-la dentro do boundary RequireAuth; se deve ser destino de retorno de login, incluir na allowlist adminReturnPath. Rotas de detalhe podem indicar activePatterns no menu para marcar o item pai.

A página não deve importar navbar/footer nem adicionar um segundo main. Usar seções/divs para seu conteúdo. Não adicionar padding baseado na altura presumida da navbar: o header está no fluxo.

Links internos usam Link; links externos usam a. Não navegar com window.location para rotas internas. Não usar rotas do navegador como endpoints HTTP.

## Conteúdo estático não é necessariamente defeito

Textos editoriais e classes de apresentação podem ficar locais quando não são compartilhados. Nomes de pessoas na biografia são conteúdo, não identidade do administrador. Não mover tudo para .env: apenas configuração de ambiente pertence ali, e VITE_* é pública.

Logo/rodapé/menus têm fonte única. JSON nome/assunto/mensagem/tema permanece português por compatibilidade, não por falta de padronização TypeScript. Não mudar sem coordenação com backend.

## Testar

Executar npm run check. navigation.test.tsx cobre shell nas rotas, sessão, menu, aliases existentes via routes.test.tsx, nomes exatos, URLs de mídia/API e datas. Testes usam serviços simulados; para ambiente real siga o [tutorial local](../development/README.md).

Conferência manual: homepage → posts → detalhe → Entrá; abrir /admin sem sessão; testar menu em tela estreita, Escape, tabulação e resize; com ADMIN conferir Painel/Sair e sidebar. A navbar só mostra ação administrativa depois da confirmação do backend.

Os componentes legados não montados foram removidos na ADR 0005, após conferir que não tinham consumidores. Edite site-content.ts para mudar o rodapé ativo. Cards públicos e administrativos agora são compartilhados em components/content; consulte o [guia de UI e feedback](ui-feedback.md).
