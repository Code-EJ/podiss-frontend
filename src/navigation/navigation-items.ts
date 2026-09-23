import { routes } from './routes';

/** Shared declarative menu contract; presentation does not own route strings. @author oEnzoRibas */
export interface NavigationItem { to: string; label: string; end?: boolean; activePatterns?: readonly string[] }

/** Editorial labels approved by the project owner; preserve their spelling. @author oEnzoRibas */
export const publicNavigation: readonly NavigationItem[] = [
  { to: routes.home, label: 'Onditudocomeçô', end: true },
  { to: routes.posts, label: 'Nossos Causos', activePatterns: [routes.postPattern] },
  { to: routes.episodes, label: 'Os Episódiu', activePatterns: [routes.videoPattern, routes.publicHome] },
  { to: routes.about, label: 'Um tiquin da gente' },
];

/** Administrative actions remain separate from public editorial navigation. @author oEnzoRibas */
export const adminNavigation: readonly NavigationItem[] = [
  { to: routes.createPost, label: 'Criar Post', end: true },
  { to: routes.admin, label: 'Listar Post', end: true },
  { to: routes.createEpisode, label: 'Criar Episódio', end: true },
  { to: routes.adminEpisodes, label: 'Listar Episódios', end: true },
  { to: routes.suggestions, label: 'Sugestões Recebidas', end: true },
  { to: routes.messages, label: 'Mensagens Recebidas', end: true },
];

export const sessionLabels = { login: 'Entrá', panel: 'Painel', logout: 'Sair', checking: 'Verificando sessão...' } as const;
