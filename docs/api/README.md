# Contratos com o backend

Créditos: oEnzoRibas. Referência: controllers/DTOs do backend irmão e smoke test local; Swagger do backend é a fonte operacional. Nenhuma tabela ou migration é manipulada pela SPA.

| Operação | Acesso | Observações |
| --- | --- | --- |
| POST /api/auth/login | Público | username/password; resposta token |
| POST /api/auth/register | ADMIN | Não existe cadastro público na UI |
| GET /posts | Público | Array paginado |
| GET /posts/{uuid} | Público | Detalhe |
| POST /posts | ADMIN | multipart: title, description, tags repetidos, image opcional |
| PUT /posts/{uuid} | ADMIN | JSON; tags array, inclusive [] |
| DELETE /posts/{uuid} | ADMIN | Exclui post |
| GET /posts/image/{uuid} | Público | Binário; ausência 404 |
| PUT /posts/{uuid}/image | ADMIN | multipart com image |
| DELETE /posts/{uuid}/image | ADMIN | Remove somente imagem |
| GET /episodes | Público | Array paginado; youtubeId fornecido pelo backend |
| GET /episodes/{youtubeId} | Público | Identificador YouTube de 11 caracteres, não UUID |
| POST /episodes | ADMIN | JSON com url do YouTube |
| DELETE /episodes/{uuid} | ADMIN | UUID interno, não youtubeId |
| POST /contatos | Público | nome, email, assunto, mensagem |
| GET /contatos | ADMIN | Array paginado |
| POST /sugestoes | Público | nome, email, tema |
| GET /sugestoes | ADMIN | Array paginado |

Listas: page começa em zero; size 1–100; order asc/desc. A UI usa desc e size 20 (destaques 3). A resposta é array, não Spring Page. X-Total-Pages precisa ser exposto por CORS; sua ausência aparece como erro, não truncamento silencioso.

Post: id UUID, title, description, tags CSV na leitura, createdAt, hasImage e imageUrl opcional. Usar hasImage antes de requisitar imagem. parseTags normaliza entrada; postForm constrói multipart sem definir boundary manual. Máximo de imagem 5 MiB; servidor continua responsável pela validação real.

Tipos ficam em src/types/api.ts. Os campos portugueses de ContactPayload/SuggestionPayload são deliberados: tradução somente do nome TypeScript não altera JSON. Datas são exibidas em pt-BR, conteúdo não é traduzido.

Sessão: login não prova ADMIN. AuthProvider verifica GET /contatos com size 1, pois JWT não traz role e não há /me. Esse resultado não é persistido como autoridade; recarregar faz nova verificação. Falha de rede nesse check encerra sessão por segurança. O backend autoriza cada operação.

O cliente HTTP não envia JWT em leituras públicas e formulários públicos. Token fica em sessionStorage; opção lembrar usa localStorage. Nenhuma senha é armazenada. 401 de token atual encerra sessão; 403 é falta de permissão; 429 pede espera. React escapa texto, mas token acessível a JavaScript continua exposto em eventual XSS: futura sessão HttpOnly exige alteração coordenada do backend.

## Mapa preliminar UI ↔ HTTP ↔ MariaDB

| UI/TypeScript | HTTP | Tabela do backend |
| --- | --- | --- |
| Post, postForm | title/description/tags/hasImage | posts |
| Episode, VideoPlayerPage | youtubeId/url | episodes |
| ContactResponse, MessageListPage | nome/email/assunto/mensagem | contact_messages |
| SuggestionResponse, SuggestionListPage | nome/email/tema | topic_suggestions |
| AuthProvider | username/password → token | users (somente backend) |

O mapa documenta responsabilidade, não autoriza acesso direto ao banco. Colunas físicas/constraints e migrations devem ser consultadas no backend, não inferidas dos nomes JSON.
