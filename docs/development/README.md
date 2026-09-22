# Desenvolvimento e testes locais

Créditos: oEnzoRibas. Não usar banco/credenciais da Hostinger. Pré-requisitos: Node >=22.12 (recomendado ambiente validado Node 24), npm e Docker Desktop para o backend.

## 1. Subir o backend

No Git Bash, na pasta podiss-backend:

```bash
docker compose --env-file .env.dev -f compose.dev.yaml up -d --build --wait --wait-timeout 180
docker compose --env-file .env.dev -f compose.dev.yaml ps -a
```

No PowerShell também é possível usar .\scripts\dev.ps1 Up. Não executar .ps1 diretamente no Bash. app/db devem estar healthy; migrate Exited (0). API local: http://localhost:18080. O backend exige .env.dev privado já preparado; não copiar senhas para o frontend.

## 2. Subir o frontend

Git Bash:

```bash
cd "/f/Users/Enzo HD/Github/Repos/CODEJR/podiss/pod-iss-frontend"
npm ci
npm run dev
```

PowerShell:

```powershell
cd "F:\Users\Enzo HD\Github\Repos\CODEJR\podiss\pod-iss-frontend"
npm ci
npm run dev
```

Abrir http://localhost:5173. Porta fixa: se ocupada, o comando falha em vez de mudar silenciosamente e quebrar CORS. Não encerrar processos desconhecidos; fechar o servidor que você iniciou ou escolher outra porta junto com a configuração CORS do backend.

Vite dev lê .env.development (versionado, URL local sem secrets). Para outra API de desenvolvimento, criar .env.development.local privado. Não é o .env.dev do Docker backend. Variável exportada no terminal prevalece; reiniciar Vite após mudar configuração.

## 3. Login e uso

Abrir /admin/login. Usuário local dev_admin; senha é DEV_ADMIN_PASSWORD do **backend/.env.dev**. Não enviar senha no chat. O bootstrap só cria o primeiro ADMIN: alterar a variável depois não troca senha existente.

Um USER pode autenticar na API, mas não entra no painel. A UI confirma ADMIN no servidor. “Lembrar Senha” lembra somente o token; sem marcar, usa sessão da aba. Logout/expiração encerra acesso; um 403 indica falta de permissão.

Teste: enviar contato/sugestão na página inicial; entrar no painel e conferir caixas de mensagens/sugestões. Criar post com e sem imagem e categorias; editar título/tags; substituir/remover imagem; consultar post público. Episódios usam URL YouTube e dependem de conectividade externa.

Conteúdo vazio é diferente de falha: mensagens de erro aparecem em português. Listas têm Anterior/Próxima quando existe mais de uma página. Não confundir título dos episódios com identificador UUID.

## 4. Conferir no banco local

Na pasta do backend, Git Bash ou PowerShell:

```sh
docker compose --env-file .env.dev -f compose.dev.yaml exec db mariadb -u podiss_dev -p podiss_dev
```

Senha: DEV_DB_PASSWORD do backend/.env.dev, digitada no prompt. Se Git Bash reclamar de TTY, usar PowerShell. No MariaDB:

```sql
SELECT DATABASE();
SELECT id, sender_name, subject, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5;
SELECT id, sender_name, topic, created_at FROM topic_suggestions ORDER BY created_at DESC LIMIT 5;
SELECT id, title, tags, image_content_type FROM posts ORDER BY created_at DESC LIMIT 5;
exit;
```

Esperado: base podiss_dev e seus registros locais. Frontend não conhece senha/host do MariaDB; usa apenas HTTP.

## 5. Verificações

```bash
npm run check
npm audit
npm run test:integration
```

check = lint + testes simulados + build. Os testes automatizados usam localhost explicitamente, não sua .env. test:integration é opt-in: exige backend local na 18080, lê a senha local sem imprimir, cria um contato e sugestão sintéticos (mantidos porque não há DELETE) e cria/remove somente seu próprio post. Nunca aponta para VITE_API_URL/produção. Não repita excessivamente: contatos têm rate limit.

Build de produção precisa de URL conhecida. Para testar build local com API local:

Git Bash: VITE_API_URL=http://localhost:18080 npm run build

PowerShell: $env:VITE_API_URL='http://localhost:18080'; npm run build

npm run preview usa http://localhost:4173: para chamar API, adicionar explicitamente essa origem em DEV_CORS_ALLOWED_ORIGINS no backend e recriar app; não usar wildcard para contornar.

## 6. Parar e resolver erros

Ctrl+C para Vite. Backend: comando down sem -v preserva dados. Mudar Java exige rebuild do backend; mudar frontend tem hot reload. Não editar migrations aplicadas.

Falha de rede: confirmar API 18080, VITE_API_URL e CORS localhost:5173. 401: novo login; 403: perfil ADMIN. 409: duplicidade. 413: imagem acima de 5MiB/request 6MiB. 429: aguardar quota. 502/504 em episódios: YouTube indisponível/timeout.

Não compartilhar .env, tokens, dumps, prints de senhas ou objetos de erro completos.
