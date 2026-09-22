# UI, feedback e imagens

Créditos: oEnzoRibas. Decisão: [ADR 0005](../ADRS/0005-ui-feedback-and-media.md).

## Responsabilidades

| Camada | Responsabilidade |
| --- | --- |
| components/ui | Button, Card, Modal, Badge, Alert, Skeleton, PageSection, AnimatedGrid, MediaPreview e CollectionState |
| components/content | PostCard e EpisodeCard com metadados reais e slot de ações |
| components/admin/inbox | Apresentação compartilhada de contatos e sugestões |
| services/content-service | Construir payloads, executar mutações e coordenar salvamento de texto/imagem |
| hooks/use-async-action | Evitar submissão duplicada, loading, sucesso e erro |
| hooks/use-resource | Consultar detalhe e cancelar resposta obsoleta |
| feedback/activity | Contar operações concorrentes; finalização idempotente |
| feedback/notifications | Estado global limitado a cinco notificações, sem guardar payloads |
| components/feedback/feedback-center | Toasts acessíveis e indicador superior |
| services/post-image-revisions + hooks/use-post-image-url | Invalidar URL de mídia depois de alteração confirmada |

## Adicionar uma operação

Defina o payload no serviço. No componente, use useAsyncAction.run com mensagens de processamento e sucesso. Mostre o erro com Alert e passe busy para Button/fieldset. Limpe campos ou feche o modal somente quando result.ok for verdadeiro. Não use alert() ou mensagens que prometam envio de e-mail quando a API apenas registra dados.

Não duplique o shell de navegação nem adicione main dentro de uma página. Use PageSection para largura e espaçamento. Prefira composição a componentes genéricos com dezenas de flags.

Coleções mantêm itens durante refresh para permitir layout animations; só a primeira carga sem dados usa skeleton. Transições de rota usam entrada suave sem manter páginas protegidas antigas montadas após logout.

## Editar foto de um post

1. Entre com um administrador e abra a lista de posts.
2. Clique em Editar e escolha um arquivo em Nova imagem do post.
3. Clique Atualizar para salvar texto e foto. Substituir imagem continua disponível para enviar somente a foto.
4. Aguarde a confirmação. Em falha parcial, o texto pode ter sido salvo; a seleção fica disponível para tentar novamente.
5. Verifique a nova imagem na listagem e no detalhe, sem precisar recarregar manualmente a página.

Tipos aceitos no cliente: JPEG, PNG, GIF e WebP até 5 MiB. O servidor continua sendo responsável por validar conteúdo e autorização. O navegador fornece o boundary multipart; não atribua Content-Type manualmente.

Não acrescente Date.now() durante cada render: isso geraria downloads desnecessários. Use a revisão emitida somente depois do sucesso da mutação. A exclusão da imagem também exige atualizar o Post para receber hasImage=false.

## Acessibilidade e limites

Botões informam aria-busy, têm estado desabilitado e texto de processamento. Modal usa dialog nativo e restaura foco/scroll ao fechar. Escape e backdrop não fecham durante gravação. Notificações usam status/alert; erros permanecem até dispensa e sucessos têm dispensa automática pausada por foco/hover.

Como dialog está no top layer, o feedback inline e o botão de processamento são a referência durante edição. Não depender de o toast global estar visível atrás dele. Testes jsdom simulam showModal/close; não comprovam sozinhos a contenção de foco de um navegador real.

MotionConfig e componentes respeitam movimento reduzido; o indicador CSS também deixa de animar. Thumbnails podem falhar e cair no fallback. A disponibilidade do player externo não pode ser garantida pelo frontend.

## Verificação

Execute npm run check. Para integração, inicie o backend Docker local conforme o [tutorial](../development/README.md) e execute npm run test:integration. O script usa exclusivamente localhost:18080, lê a senha local sem imprimi-la, cria dados sintéticos e remove somente seu próprio post. Contato e sugestão permanecem por não haver rotas de exclusão.

Checklist manual: seleção de nova foto + Atualizar; edição só de texto; falha de upload; Substituir imagem; Remover imagem; thumbnail quebrada; modal via teclado; menu mobile; layout a 390, 768 e 1440 px; preferência de movimento reduzido.
