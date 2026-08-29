import React, { useState } from 'react';
import ButtomForm from './buttom-form';
import TextField from './text-field';
import { API_URL } from '../../database';

const ContactForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [mensage, setMensage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const contato = {
      nome: name,
      email: email,
      assunto: subject,
      mensagem: mensage
    };

    try {
      const response = await fetch(`${ API_URL }/contatos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contato)
      });

      if (response.ok) {
        await response.json();
        alert('Mensagem de contato enviada com sucesso!');
        setName('');
        setEmail('');
        setSubject('');
        setMensage('');
      } else {
        console.error('Erro ao enviar contato:', response.statusText);
        alert('Ocorreu um erro ao enviar a mensagem de contato.');
      }
    } catch (error) {
      console.error('Erro ao enviar contato:', error);
      alert('Ocorreu um erro ao enviar a mensagem de contato.');
    }
  };

  return (
    <section className="max-w-3xl p-8 mx-auto mt-8 bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Contato</h2>
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
          label="Assunto"
          placeholder="Digite o assunto"
          value={subject}
          onChange={value => setSubject(value)}
        />

        <TextField
          required={true}
          label="Mensagem"
          placeholder="Digite a mensagem"
          value={mensage}
          onChange={value => setMensage(value)}
        />

        <ButtomForm>
          Manda pra nóis!
        </ButtomForm>
      </form>
    </section>
  );
};

export default ContactForm;

