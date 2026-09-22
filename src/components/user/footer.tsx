import React from 'react';

/**
 * Renders existing editorial footer content unchanged; contact placeholders require an editorial decision.
 * @author oEnzoRibas
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 text-center">
      <div className="container mx-auto">
        <p>Uai, sô! Fique à vontade pra prosear com a gente e acompanhá nossas histórias cheias de causos de Minas!</p>
        <p>
          &copy; {new Date().getFullYear()}
          &nbsp;
          <a 
          href="https://juniorcode.com.br" 
          className="underline hover:text-gray-400">
            Code [] Soluções em Tecnologia Júnior.  
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
