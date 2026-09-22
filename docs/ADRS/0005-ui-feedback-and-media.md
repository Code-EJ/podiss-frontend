# ADR 0005 — Componentes, feedback e atualização de mídia

Data: 2026-09-22. Status: implementada localmente. Créditos: oEnzoRibas.

## Contexto

Páginas públicas e administrativas repetiam cards, estados de requisição e formulários. Listagens de vídeos montavam players pesados. O editor enviava texto e imagem por ações independentes: selecionar um arquivo e clicar Atualizar não enviava a imagem. Mesmo após substituir a imagem, a URL binária permanecia igual, sem forçar a atualização dos elementos img já montados.

## Decisão

- Manter contratos HTTP, autenticação, nomes da navbar, logo, conteúdo editorial em português e paleta original. Verde, vermelho e âmbar indicam sucesso, erro e processamento.
- Componentes tipados em components/ui; cards de domínio em components/content; payloads e mutações em contentService; coordenação assíncrona em useAsyncAction e carregamento cancelável em useResource.
- Usar Motion para React via motion/react, com AnimatePresence, layout e respeito a prefers-reduced-motion. CSS continua responsável por layout, cores e estados simples.
- Contar requisições/operações ativas para um indicador indeterminado. Não apresentar porcentagens fictícias. Skeleton inicial e conteúdo preservado durante atualização das coleções.
- Usar dialog nativo para modalidade, foco e Escape, com bloqueio de fechamento durante mutação. Erros também ficam inline: o top layer do dialog pode cobrir as notificações globais.
- Usar thumbnails lazy com proporção 16:9, fallback e overlay de reprodução. Player apenas no detalhe. Não inventar autor, avatar ou contagem de curtidas ausentes no contrato.
- Ao clicar Atualizar, validar a imagem selecionada antes de gravar, atualizar texto e então enviar imagem. Só informar sucesso completo depois das duas respostas.
- Após substituição ou remoção confirmada, invalidar a revisão de imagem em memória e atualizar a URL dos consumidores para incluir ?v=. Isso força uma nova requisição sem alterar o endpoint.

## Consequências e limites

Texto e imagem continuam sendo duas transações HTTP. Se a segunda falhar, o texto pode estar salvo: a mensagem explicita o resultado parcial e o modal mantém arquivo e campos para nova tentativa. Não há rollback distribuído nem garantia de atomicidade. Falha de rede também pode ocorrer depois de o servidor persistir; por isso a mensagem fala em falta de confirmação.

A revisão é compartilhada apenas na aba atual, não é uma versão persistida nem uma sincronização entre navegadores. Uma futura versão/ETag fornecida pelo backend exigiria decisão de contrato e cache própria. Consultas ?v= foram verificadas contra o backend local.

Motion aumenta o bundle. O build desta rodada tem aproximadamente 138 kB de JavaScript gzip, comparado a aproximadamente 93 kB antes da biblioteca. Não foi realizado benchmark de desempenho nem certificação de acessibilidade.

Sete componentes legados não utilizados foram removidos junto ao CSS sem consumidores; continuam recuperáveis no Git. A fonte ativa dos textos do rodapé permanece site-content.ts.

Não há migrations, mudança de banco, configuração de e-mail ou deploy nesta ADR. Publicação e rollback continuam no [procedimento existente](../deployment/README.md).

## Referências

- [Instalação oficial do Motion para React](https://motion.dev/docs/react-installation).
- [AnimatePresence](https://motion.dev/docs/react-animate-presence).
- [Animações de layout](https://motion.dev/docs/react-layout-animations).
- [Preferência de movimento reduzido](https://motion.dev/docs/react-use-reduced-motion).
- [Guia de manutenção](../architecture/ui-feedback.md).
- [Relatório de validação](0005/reports/01-final-report.md).
