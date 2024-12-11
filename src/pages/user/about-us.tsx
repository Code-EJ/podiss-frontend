import React from 'react';

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
}

const team: TeamMember[] = [
  {
    name: 'Felipe Araujo',
    position: 'Desenvolvedor Full Stack',
    bio: 'Felipe é um desenvolvedor com experiência em diversas tecnologias como JavaScript, TypeScript, React, Node.js e mais.',
    imageUrl: 'https://github.com/FelipeGA02.png',
  },
  {
    name: 'Joana Silva',
    position: 'Designer UI/UX',
    bio: 'Joana é uma designer apaixonada por criar interfaces intuitivas e agradáveis para os usuários.',
    imageUrl: 'https://github.com/FelipeGA02.png',
  },
];

const AboutUs: React.FC = () => {
  return (
    <div className="px-6 py-8 font-sans">
      <h1 className="text-4xl font-semibold mb-6 text-center">Sobre Nós</h1>
      
      <div className="flex flex-col items-center mb-12">
        <img
          src="https://s2-g1.glbimg.com/c4cIy6uiqHKoHT580oea1lNuMf0=/0x0:4608x3072/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2018/I/j/BitFoaS9eTy4xqUhA5UA/img-2417.jpg"
          alt="Missão"
          className="w-1/5 h-1/3 rounded-lg mb-4"
        />
        <h2 className="text-3xl font-medium mb-4 text-center">Óia Nóis</h2>
        <p className="text-lg text-center max-w-4xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad accusantium quam temporibus, doloribus earum mollitia nisi tempore architecto repellendus dolorum facilis ratione sed ea, inventore ab dignissimos laborum quidem recusandae sit nostrum. Iusto, unde deserunt aliquam sit debitis, pariatur porro eius magnam rerum officia amet harum quisquam maiores cumque quas fugit nam esse, ipsam iste accusantium quia quibusdam autem est. Eligendi hic eaque optio facere aliquam similique delectus vitae. Sit, laborum commodi odio labore voluptate consequatur, nisi modi amet beatae voluptatibus eius deserunt. Perspiciatis deserunt inventore fugit ex facere rem temporibus hic est eveniet eaque magnam quaerat soluta, debitis dolorum.
        </p>
      </div>
      
    </div>
  );
};

export default AboutUs;