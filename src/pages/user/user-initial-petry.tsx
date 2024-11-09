// src/pages/user/UserHomePage.tsx
import React, { useState } from 'react';
import Header from '../../components/user/header';
import UserNavbar from '../../components/user/user-navbar';
import EpisodeCard from '../../components/user/episode-card';
import HighlightCard from '../../components/user/high-light-card';
import SuggestionForm from '../../components/user/suggestion-form';
import ContactForm from '../../components/user/contact-form';


const UserInitialHomePage: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleLoginModal = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  return (
    <div className="bg-gray-100 text-gray-800">
  
      <Header onToggleLoginModal={toggleLoginModal} />
      <UserNavbar />


      <section id="sobre" className="container mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6">Sobre o Podcast</h2>
        <p className="text-lg leading-relaxed">
          Ô sô! Aqui você vai escutá muita prosa boa sobre vários assuntos. Junte-se a nóis e fique por dentro de tudo!
        </p>
      </section>

      <section id="ultimos-episodios" className="container mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6">Últimos Episódios</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <EpisodeCard image="/episode1.jpg" title="Capítulo #10" description="Tá imperdível, escuta esse trem!" />
          <EpisodeCard image="/episode2.jpg" title="Capítulo #9" description="Se achega e dá uma ouvida!" />
          <EpisodeCard image="/episode3.jpg" title="Capítulo #8" description="Vem que tem mais prosa boa aqui!" />
        </div>
      </section>


      <section id="destaques" className="container mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6">Destaques</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <HighlightCard image="/highlight1.jpg" title="Live #5" description="Vai lá e vê, sô!" />
          <HighlightCard image="/highlight2.jpg" title="Vídeo #3" description="Se liga nesse trem, é bão demais!" />
        </div>
        <div className="mt-10 text-center">
          <h3 className="text-2xl font-semibold mb-4">Exemplo de Vídeo do Podcast</h3>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Exemplo de Vídeo"
            frameBorder="0"
            allowFullScreen
            className="mx-auto rounded-lg shadow-md"
          ></iframe>
        </div>
      </section>


      <div className="container mx-auto my-10 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <SuggestionForm />
        <ContactForm />
      </div>

      <footer className="bg-gray-800 text-white text-center p-6">
        <p>Ô gente, entra em contato com a gente por email: contato@podcast.com</p>
      </footer>

      
    </div>
  );
};

export default UserInitialHomePage;
