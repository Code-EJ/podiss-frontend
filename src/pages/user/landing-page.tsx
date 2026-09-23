import { apiPaths } from '../../services/api-paths';
import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import type { Episode } from '../../types/api';
import { EpisodeCard } from '../../components/content/episode-card';
import { AnimatedGrid } from '../../components/ui/animated-grid';
import { CollectionState } from '../../components/ui/collection-state';
import SuggestionForm from '../../components/user/suggestion-form';
import ContactForm from '../../components/user/contact-form';

/** Retains editorial identity while composing reusable, independently loading sections. @author oEnzoRibas */
export default function LandingPage() {
  const result = usePaginatedResource<Episode>(apiPaths.episodes, 3);
  return <div>
    <section className="welcome-section py-12">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">Ô trem bão! Bem Vindo ao Podcast</h1>
        <p className="mt-4 text-lg sm:text-xl">Estamos contribuindo para trazer entretenimento e informações para todos.</p>
      </div>
    </section>
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-center text-3xl font-semibold text-zinc-800 sm:text-4xl">Destaques</h2>
      <CollectionState {...result} count={result.items.length} empty="Nenhum episódio encontrado." />
      <AnimatedGrid items={result.items}>{episode => <EpisodeCard episode={episode} />}</AnimatedGrid>
    </section>
    <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <SuggestionForm /><ContactForm />
    </div>
  </div>;
}
