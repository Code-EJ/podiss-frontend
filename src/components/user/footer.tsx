import React from 'react';

/**
 * Renders existing editorial footer content unchanged; contact placeholders require an editorial decision.
 * @author oEnzoRibas
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 text-center">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Code [ ]. Todos os direitos reservados.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores libero velit officiis odit deleniti ipsum dolores sequi debitis possimus molestias, officia, nulla excepturi accusantium aperiam ut voluptatum, quos repellat tempora.</p>
        <p className="mt-2">
          Entre em contato conosco: <a href="mailto:contato@exemplo.com" className="underline hover:text-gray-400">contato@exemplo.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
