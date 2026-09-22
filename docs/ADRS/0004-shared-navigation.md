# ADR 0004 — Navegação global e configuração modular

Status: aceita e implementada localmente. Data: 2026-09-22. Créditos: oEnzoRibas.

## Contexto

A navbar tinha nomes editoriais aprovados pelo usuário, mas era montada em múltiplos lugares: landing própria, layout público e player. Login, detalhe de post e painel não tinham o mesmo shell. Desktop/mobile repetiam os links, a sidebar duplicava rotas e o painel saudava uma pessoa fixa. Essa estrutura permitia divergências sem qualquer necessidade de autenticação.

O usuário já havia editado navbar, footer, container-video, header e form-button. A decisão precisava preservar essas alterações, não restaurar arquivos ao HEAD. O checkout base desta rodada já continha React Router 7.18.4 no commit cdcf7e0; não houve atualização de dependências por esta ADR.

## Decisão

1. SiteLayout envolve todas as rotas: uma SiteNavbar, um main e um SiteFooter. AdminLayout adiciona apenas a sidebar e o Outlet protegido por RequireAuth.
2. SiteNavbar é global. Visitantes veem Entrá; ADMIN verificado vê Painel/Sair; durante verificação aparece estado de espera. Navegação pública não depende de login.
3. NavigationLinks recebe itens tipados e callbacks; renderiza uma única lista responsiva. Rotas e agrupamentos ativos vêm de navigation/, não dos componentes.
4. routes.ts representa URLs do navegador; services/api-paths.ts representa contratos HTTP. Não misturar os dois: /home/posts e /posts possuem responsabilidades diferentes.
5. navigation-items.ts guarda nomes de menus; site-content.ts guarda identidade e rodapé. Helpers de domínio compartilham tags, datas e URLs YouTube.
6. Conteúdo específico de uma página permanece próximo dela. Não criar um objeto gigante de traduções, CMS, classe base, container DI ou camada Repository artificial apenas para remover literais.
7. Destino pós-login limitado às rotas conhecidas do painel. Aliases antigos continuam redirecionando para destinos protegidos.

## SOLID, KISS e DRY aplicados

Responsabilidade única: layout compõe, navegação apresenta, SessionActions lida com ações de sessão, configuração define nomes e helpers validam/formam valores.
Extensão: adicionar item não exige copiar markup desktop/mobile.
Interfaces pequenas: NavigationItem e props limitadas ao necessário; componentes funcionais por composição, sem herança.
Dependências: links genéricos dependem de dados/props; autorização continua no AuthContext/backend. Não declarar uma implementação universal de todos os princípios SOLID, especialmente Liskov, onde não existe hierarquia a substituir.
KISS/DRY: reusar somente regras realmente compartilhadas, sem centralizar cada frase/classe CSS.

## Compatibilidade e consequências

Sem mudança de endpoint, JSON, autenticação backend, banco, migration, env, lockfile ou dependências. Rotas antigas continuam válidas. Detalhes e erros passam a ter navegação; desaparecem os offsets pt-28 que compensavam headers fixos duplicados. Header sticky fica no fluxo; modais do painel mantêm z-index superior.

Preservados literalmente: Onditudocomeçô, Nossos Causos, Os Episódiu, Um tiquin da gente, Entrá e o link do rodapé. A mensagem do rodapé recebeu nova edição paralela em site-content.ts, também preservada.
Painel administrativo substitui a saudação fixa a Yolanda; biografia editorial não foi alterada.
Menus administrativos continuam separados: não exibir suas ações para visitantes nem tratar presença de link como autorização.

## Verificação e limites

51 testes, lint/build e smoke responsivo local descritos no [relatório final](0004/reports/01-final-report.md). Não foi realizada publicação ou homologação remota. As edições preexistentes não relacionadas em header/form-button e o footer legado reaparecido durante a tarefa permanecem fora do commit desta refatoração; as rotas montam somente SiteFooter.
