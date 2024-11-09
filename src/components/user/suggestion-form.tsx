import React, { useState } from 'react';
import ButtomForm from './buttom-form';
import TextField from './text-field';

const SuggestionForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [theme, setTheme] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setName('');
    setEmail('');
    setTheme('');
  };

  return (
    <section className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sugira um Tema</h2>
      <form className="flex flex-col" onSubmit={handleSubmit}>

        <TextField
            required={true}
            label="Nome"
            placeholder="Digite seu nome"
            value={name}
            onChange={value => setName(value)} />
        
        <TextField
            required={true}
            label="Email"
            placeholder="Digite seu email"
            value={email}
            onChange={value => setEmail(value)} />
        
        <TextField
            required={true}
            label="Tema"
            placeholder="Digite o tema"
            value={theme}
            onChange={value => setTheme(value)} />

        <ButtomForm>
            Mandá pra nóis!
        </ButtomForm>
        
      </form>
    </section>
  );
};

export default SuggestionForm;