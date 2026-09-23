# Publicação do frontend e retorno à versão anterior

Créditos: oEnzoRibas. **Nenhum deploy foi realizado por esta revisão.**

## Pré-condições bloqueantes

Confirmar com o responsável: onde podiss.com.br serve arquivos (hPanel ou Nginx da VPS), document root correto, domínio HTTPS real da API, serviço Java ativo e CORS. A existência da VPS Ubuntu 24.04 não comprova que ela serve o domínio. phpMyAdmin não identifica sozinho a localização do MariaDB. Não publicar enquanto essas informações estiverem indefinidas.

Frontend é estático: publicar somente o conteúdo de dist. Java/JAR e banco seguem o procedimento do backend; hospedagem compartilhada não deve ser tratada como runtime Java. Não precisa de Docker para servir esta SPA.

## 1. Preparar e verificar localmente

Usar Node 24, npm ci e npm run check. Executar o teste de integração local conforme o tutorial. Configurar VITE_API_URL com a URL HTTPS confirmada em .env.production.local ou variável de pipeline. Não usar localhost nem HTTP em site HTTPS.

Executar npm run build. Conferir a configuração antes do build e testar os arquivos gerados com npm run preview (origem 4173 deve ser autorizada no backend para testar chamadas). Separar artefato por SHA do commit e guardar checksum/versão Node/URL pública utilizada. O CI atual verifica, não faz publicação.

## 2. Backup antes da publicação

No hPanel, abrir o gerenciador de arquivos do site confirmado, baixar cópia dos arquivos atualmente publicados e da configuração .htaccess. Usar também Backups do hPanel quando disponível e verificar possibilidade de restauração. Não assumir que backup diário terminou com sucesso.

Para mudanças de backend/banco, fazer exportação independente: phpMyAdmin → selecionar a base correta → Exportar → Personalizado → SQL, estrutura e dados, todas as tabelas necessárias → salvar arquivo fora do repositório, com acesso restrito. Registrar base, data e versão e testar restauração em base isolada. **Publicar apenas frontend não requer apagar, recriar ou importar banco.**

## 3. Publicação estática

No hPanel, enviar o conteúdo de dist ao document root confirmado, sem apagar uploads, APIs, arquivos de outros sites ou configurações existentes. Não enviar src, node_modules, .env ou credenciais. Preservar a versão anterior para rollback; preferir release em pasta separada quando o ambiente permitir troca controlada.

BrowserRouter exige que URLs da SPA como /admin/login retornem index.html. Em Apache/LiteSpeed, regra mínima ilustrativa (revisar e mesclar com .htaccess existente, nunca sobrescrever sem análise):

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^ index.html [L]
```

**A regra acima pressupõe document root exclusivo da SPA e API em outro domínio.** Se houver API no mesmo host, suas rotas/proxy precisam ter prioridade e ficar fora do fallback. /posts pode conflitar com navegação da SPA; definir prefixo /api no proxy exige preservar o mapeamento esperado pelo backend (login já contém /api/auth). Não inventar prefixo sem teste.

Se o site estiver no Nginx da VPS, a alternativa é configurar try_files para a SPA e location do proxy separadamente. Revisar configuração existente e validar nginx -t antes de qualquer reload; este relatório não fornece comando de overwrite nem modifica serviços.

## 4. Aceite após publicação

Abrir página inicial e links profundos diretamente/recarregar; verificar CSS/assets sem 404, lista de posts e episódios, ausência de mixed content e CORS, login ADMIN e logout. Testes de escrita em produção somente com autorização e dados identificados. Confirmar comportamento sem autenticação e sem divulgar token.

Backend deve estar disponível ao navegador, não apenas ao servidor de build. Manter TLS, limitar origens CORS, impedir cache prolongado de index.html e permitir cache de assets versionados por hash. Planejar CSP conforme scripts/fonts/YouTube usados, validando antes de impor.

## 5. Rollback

Republicar artefato anterior e restaurar apenas configuração web alterada, limpar cache do site/CDN quando aplicável e repetir smoke de leitura. Se o backend mudou de contrato, alinhar versão compatível antes de voltar. Não restaurar dump nem executar Flyway para resolver falha exclusiva de frontend. Registrar release, horário, resultado e responsável no histórico operacional.
