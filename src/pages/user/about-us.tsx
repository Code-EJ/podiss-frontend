import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="font-sans">
      {/* Primeira Seção - Introdução com Gradiente */}
      <section className="bg-gradient-to-b from-red-600 to-red-800 text-white text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Sobre Nós</h1>
        <p className="text-lg max-w-3xl mx-auto px-4">
          Seja bem-vindo ao <strong>PODISS!</strong> Um espaço onde compartilhamos histórias, causos e muita inspiração com um toque mineiro.
        </p>
      </section>

      {/* Segunda Seção - História */}
      <section className="bg-white text-black py-12 px-6 sm:px-12 lg:px-32">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Texto */}
          <div className="sm:w-1/2 text-lg leading-relaxed max-w-4xl">
            <p className="mb-4">
              <strong>PODISS?</strong> Foi o que perguntei à minha tia, quando ela me contava histórias sobre traduções feitas
              diretamente do português para o inglês. Uma delas envolvia a professora Sueli.
            </p>
            <p className="mb-4">
              Em seu primeiro dia de aula, Sueli começou a falar com os alunos em inglês, fazendo perguntas “simples” como:
              “How are you”, “What is your name” às quais os alunos, morrendo de vergonha, iam respondendo como podiam. Então,
              Sueli para em frente a uma aluna e pergunta:
            </p>
            <p className="italic mb-4">“How old are you?”</p>
            <p className="mb-4">
              A menina se levanta e, enfurecida, desfere:
            </p>
            <p className="italic font-semibold text-center mb-4">“I am not old! Old are… you!”</p>
            <p className="mb-4">
              Outras traduções estranhas andam povoando a língua de brasileiros que desejam brincar com as traduções diretas.
              Esses “causos” me inspiraram a criar este podcast.
            </p>
          </div>
          {/* Imagem */}
          <div className="sm:w-1/2">
            <img
              src="/images/yolanda/yolanda_3.jpeg"
              alt="Yolanda"
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Terceira Seção - Conclusão */}
      <section className="bg-white text-black py-12 px-6 sm:px-12 lg:px-32">
        <div className="text-lg leading-relaxed max-w-4xl mx-auto">
          <p className="mb-4">
            Contudo, este podcast não é somente sobre casos engraçados ou sobre o jeito mineiro de dizer as coisas. Sou a criadora da ideia, nasci em Belo Horizonte, MG, amo meu país. 
          </p>
          <p className="mb-4">
            Sou filha, mãe de três filhos lindos, dois que ainda moram em Belo Horizonte, e uma menina que mora comigo nos Estados Unidos, mulher, amiga, companheira e feliz. Aprendo todos os dias a levar uma vida mais leve e suave. 
          </p>

          <blockquote className="border-l-4 border-gray-400 p-4 mb-4">
            Sou professora de Português numa High School e lido o tempo todo com situações que eu mesma vivencio na pronúncia do inglês.
            
          </blockquote>

          <p className="mb-4">
            A ideia nasceu para levar leveza a todos, situações engraçadas, inusitadas e mesmo dúvidas, porque a pergunta “Pode isso?” cabe em qualquer situação destas anteriormente ditas.
          </p>

          <ul>
            <li>Espero que vocês curtam e divirtam-se.</li>
            <li>Aprendam conosco.</li>
            <li>Compartilhem ideias e fatos interessantes.</li>
          </ul>

          <p className="text-right font-semibold">
            Sejam muito bem-vindos! Com carinho,<br />
            <span className="italic">Yolanda Gramiscelli</span>
          </p>
        </div>
    </section>
    </div>
  );
};

export default AboutUs;
