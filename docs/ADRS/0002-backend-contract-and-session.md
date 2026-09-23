# ADR 0002 — contrato HTTP e sessão administrativa

Status: Accepted. Créditos: oEnzoRibas.

## Contexto

O backend novo preserva payloads portugueses em contatos/sugestões, usa schema físico inglês e exige ADMIN para operações editoriais. JWT contém subject/exp/issuer, mas não role. O frontend não acessa MariaDB nem executa Flyway.

## Decisão

Centralizar Axios em src/api.ts, com timeout de 15s, caminhos relativos e tratamento de 401. Rotas públicas não recebem token armazenado. Erros esperados são mostrados em português, sem logs de dados pessoais/headers. Tipos HTTP em src/types/api.ts; Post retorna tags string, gravação usa array/multipart repetido.

AuthProvider só abre o painel após GET /contatos?page=0&size=1 autorizado pelo servidor. Não confiar na presença do JWT nem em decode local para ADMIN. Essa leitura é uma solução compatível sem alterar o backend; um endpoint /me mínimo é melhoria futura, não foi inventado como contrato existente.

Por padrão, token em sessionStorage; opção existente “Lembrar Senha” persiste apenas token em localStorage, com descrição acessível explicando que não salva senha. Expiração agenda logout; 401 protegido limpa a sessão. Sem refresh token, sem alteração de política de expiração no backend. Falha no probe após recarregar remove a sessão (fail closed); pode exigir novo login após indisponibilidade.

Um token salvo continua acessível a JavaScript: XSS é risco residual. Não alegar que sessionStorage equivale a cookie HttpOnly. Troca por cookies exigiria decisão backend/CSRF. Armazenamento legado token é removido; primeiro acesso após atualização pode exigir novo login.

## Compatibilidade

JSON nome/assunto/mensagem/tema e endpoints /contatos e /sugestoes preservados. URLs de navegação novas /home/about, /admin/suggestions e /admin/messages têm redirects legados. Textos editoriais mantidos. GET episódio usa YouTube ID, DELETE usa UUID; nunca intercambiar.

Paginação: arrays e headers X-Total-*; order=desc no servidor. Highlights usam size=3. CORS precisa expor headers; a UI mostra erro explícito se o contrato estiver ausente.

## Verificação

Testes de transporte, expiração, storage, autorização, formulários e paginação; smoke HTTP com backend Docker. Não substitui pentest nem teste de produção.
