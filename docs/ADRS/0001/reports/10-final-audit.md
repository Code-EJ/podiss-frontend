# Auditoria final — etapa 10

Data: 2026-09-22. Créditos: oEnzoRibas. Frontend na branch dev, backend refactor-fixall. Revisão local concluída; **homologação/publicação na Hostinger pendentes**.

## 1. Arquitetura e baseline

SPA React 18/TypeScript/Vite 7, React Router 6, Tailwind 3. Cliente HTTP único, contexto de sessão verificado pelo servidor, contratos tipados e hook de paginação. Layout público e painel ADMIN; servidor Java e MariaDB continuam separados. Baseline está no relatório 01; mudanças no 02–09. Não há classes artificiais nem banco/Flyway no frontend.

## 2. Configuração

VITE_API_URL validada, .env.development público com localhost:18080, .env.*.local privado, .env existente preservado. Vite escuta localhost:5173; preview 4173. Variáveis VITE são públicas no bundle. CI sem credenciais verifica Node 24/npm ci/check/audit com limite high. Tutorial cobre PowerShell/Git Bash e backend/.env.dev.

## 3. Dependências

Next/heroicons ociosos removidos. Lockfile reinstalado com sucesso usando Node v24.12.0/npm 11.6.2. Axios/Vite/TypeScript/tooling atualizados. npm audit --audit-level=high terminou com código 0, mas **não significa ausência de vulnerabilidade**: restam 2 entradas moderadas (react-router e react-router-dom), cobrindo advisories de redirect e SSR. Nenhuma alta/crítica no resultado observado. ESLint 8 e transitivas antigas geram avisos de depreciação.

Mitigações e fontes primárias no relatório 02–09. React Router 7 corrigido requer migração/regressão separada; não foi aplicado audit fix --force. Contagem do scanner pode mudar sem mudança de código.

## 4. Nomenclatura e mapa de impacto

TS_ONLY: nomes internos/arquivos em inglês e comentários TSDoc. API_IMPACT: rotas do navegador inglesas com aliases legados; JSON/endpoints portugueses preservados. CONFIGURATION_IMPACT: versões Node/Vite, ambiente local e publicação estática documentados. DATABASE_IMPACT: nenhuma alteração de schema por esta revisão.

Mapa UI/HTTP/tabelas em docs/api/README.md. Nomes próprios, biografia, saudação Yolanda, expressões regionais e textos do site mantidos. Interfaces inglesas não traduzem automaticamente nomes JSON.

## 5. Banco e Flyway

A migration histórica pendente do backend foi restaurada ao conteúdo original e o rascunho arquivado na ADR 0007, commit 862e4cb. A migration fresh ativa não foi editada.

Na repetição final, Docker estava desligado. Docker Desktop e serviços locais existentes foram iniciados, sem remoção de volume. Compose acionou migrate por dependência: validou 1 migration e informou schema podiss_dev na versão 1, sem migration necessária. Não houve alteração de schema nem acesso remoto.

Flyway 10.20.1 avisou que MariaDB 11.8 é mais recente que sua matriz testada (11.2). Apesar da validação local bem-sucedida, compatibilidade oficial deve ser resolvida no backend antes de produção. Não omitir esse aviso nem inferir suporte pleno do sucesso de um smoke test.

## 6. Segurança

JWT não é aceito como prova local de ADMIN: GET protegido verifica acesso. Expiração, logout, 401 atual e falha de validação encerram sessão. Requisições públicas não recebem token armazenado. Senha não é persistida; opção lembrar guarda apenas token.

Risco residual: sessionStorage/localStorage são acessíveis em XSS. Futura sessão HttpOnly depende do backend, CSRF e política de cookies. Não houve pentest, certificação OWASP ou teste completo de abuso. CSP/TLS/headers/CORS reais precisam ser verificados no host confirmado.

## 7. Funcionalidade e testes executados

| Verificação | Resultado observado |
| --- | --- |
| npm ci | Passou; lockfile reproduzível neste ambiente |
| npm run check | Lint sem warnings, 28 testes em 3 arquivos e build passaram |
| npm audit --audit-level=high | Passou o limite high; 2 moderadas permanecem |
| npm run test:integration | Passou contra localhost:18080 + MariaDB Docker |
| git diff --check | Passou |
| Navegador local | Lista de post real, tela de login, erro de credencial inválida e redirect de rota ADMIN sem sessão verificados |

Unitários/componentes cobrem tags multipart/vazias, imagem inválida, sessão/remember/expiração, envio seletivo de JWT/401, transporte, formulários, paginação/headers, verificação ADMIN e URLs antigas/404.

Integração HTTP real cobriu login, GET protegido 401 sem sessão, POST e leitura ADMIN de contato/sugestão, CORS/header exposto, criação de post sem imagem com duas tags, proibição de DELETE anônimo, leitura pública, edição/limpeza de tags, upload/leitura binária/remoção de imagem, paginação, listagem de episódios e youtubeId inválido.

O post temporário foi removido no finally; nenhum post preexistente foi excluído. Cada execução mantém **um contato e uma sugestão sintéticos**, pois essas rotas não oferecem exclusão. Marcadores das execuções desta revisão:
- frontend-smoke-9dcc2838-a50f-40af-a66d-12bb6f3b0510
- frontend-smoke-81080d99-eada-421e-9099-b02f091a42e2

Esses dados estão somente na base local podiss_dev. O smoke usa origin fixo, não lê VITE_API_URL e não expõe senha/token em logs.

## 8. Cobertura não executada

Não foram executados: criação/remoção de episódio real dependente do YouTube; E2E completo do painel por navegador com ADMIN; testes de carga, todas as larguras/dispositivos, regressão visual completa ou acessibilidade com leitor de tela; cenários HTTPS/proxy/CDN da Hostinger; backup/restauração remoto. O build não prova funcionamento dessas camadas.

A skill de navegador foi usada para conferir UI/erros/guarda de rota local; integrações de escrita foram verificadas pelo script HTTP. Não confundir testes simulados com integração real ou com homologação em produção.

## 9. DevOps e riscos para produção

Procedimento documentado para dist estático, URL HTTPS incorporada no build, fallback de SPA, backup de arquivos, exportação SQL e rollback. Nenhum push/deploy/import/export remoto foi feito. Falta confirmar document root, host da API e se o domínio é servido pela hospedagem compartilhada ou VPS. Fallback genérico pode capturar rotas API se a topologia for mal definida.

Não publicar build local com localhost. Frontend jamais recebe credenciais MariaDB/VPS. Não apagar banco para resolver um erro de frontend.

## 10. Dívida técnica

Prioridade P1 antes da publicação: confirmar topologia/TLS/CORS e compatibilidade de Flyway no backend; executar aceite remoto autorizado.
P2: migrar React Router à versão corrigida com testes; modernizar ESLint; ampliar cobertura de imagem/painel/YouTube; melhorar modal com foco/teclado; preferir endpoint /me para evitar leitura mínima de contato na verificação de ADMIN.
P3: decidir conteúdo editorial placeholder do rodapé, saudação fixa e destino dos componentes de apresentação não montados. Não reescrever conteúdo editorial por conta própria.

## 11. Mudanças seguras e mudanças coordenadas

Seguras no escopo local: comentários, testes, nomes internos/imports e correções de formulário respeitando contrato. Exigem coordenação: eliminar aliases, traduzir JSON/endpoints, migrar Router major, mudar sessão para cookies, alterar URL/origem de produção, editar schema/migrations ou remover dados. A preservação de compatibilidade não é promessa de ausência de bugs.

## 12. Perguntas antes de produção

1. Quem serve podiss.com.br e qual document root está ativo?
2. Qual domínio HTTPS chega ao backend Java e quais origens CORS são autorizadas?
3. Qual procedimento de restart/rollback está validado na VPS?
4. Existe backup testado dos arquivos e do MariaDB e responsável pelo aceite?
5. Quando será planejada a migração React Router e a atualização compatível do executor Flyway?
6. Quem aprova o conteúdo editorial placeholder e executa o aceite YouTube/painel?

## 13. Histórico e conclusão

Commits organizados e locais: 17ba265 (baseline), 20df1e7 (implementação/ambiente/TSDoc), d264bce (testes/CI), seguidos pelo commit de documentação final que contém este relatório. Consultar git log --oneline para o último ID. Créditos @author oEnzoRibas nos componentes/helpers e documentos, sem alterar licença ou titularidade.

As dez etapas de revisão do frontend estão documentadas e a integração local passou, com as limitações acima. **Não declarar produção pronta** até resolver os gates de infraestrutura/compatibilidade e realizar a homologação.
