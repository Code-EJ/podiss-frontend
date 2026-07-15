import React, { useState } from 'react';
import ButtomForm from './buttom-form';
import TextField from './text-field';
import GetUrl from '../../database';

const SuggestionForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [theme, setTheme] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const sugestao = {
      nome: name,
      email: email,
      tema: theme,
    };

    try {
      const response = await fetch(`${GetUrl()}/sugestoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sugestao)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Sugestão enviada com sucesso:', data);
        alert('Sugestão enviada com sucesso! Obrigado por contribuir!');
        setName('');
        setEmail('');
        setTheme('');
      } else {
        console.error('Erro ao enviar sugestão:', response.statusText);
        alert('Ocorreu um erro ao enviar a sugestão.');
      }
    } catch (error) {
      console.error('Erro ao enviar sugestão:', error);
      alert('Ocorreu um erro ao enviar a sugestão.');
    }
  };

  return (
    <section className="max-w-3xl p-8 mx-auto mt-8 bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Sugira um Tema</h2>
      <form className="flex flex-col" onSubmit={handleSubmit}>

        <TextField
          required={true}
          label="Nome"
          placeholder="Digite seu nome"
          value={name}
          onChange={value => setName(value)}
        />
        
        <TextField
          required={true}
          label="Email"
          placeholder="Digite seu email"
          value={email}
          onChange={value => setEmail(value)}
        />
        
        <TextField
          required={true}
          label="Tema"
          placeholder="Digite o tema"
          value={theme}
          onChange={value => setTheme(value)}
        />

        <ButtomForm>
          Manda pra nóis!
        </ButtomForm>

      </form>
    </section>
  );
};

export default SuggestionForm;
