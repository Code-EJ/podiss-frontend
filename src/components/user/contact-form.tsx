import { apiPaths } from '../../services/api-paths';
import React, { useState } from 'react';
import FormButton from './form-button';
import TextField from './text-field';
import api, { errorMessage } from '../../api';
import type { ContactPayload } from '../../types/api';

/**
 * Submits public contact data using legacy Portuguese wire keys. Failed requests preserve the user's input.
 * @author oEnzoRibas
 */
const ContactForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true); setError(null);

    const contact: ContactPayload = {
      nome: name,
      email: email,
      assunto: subject,
      mensagem: message
    };

    try {
      await api.post(apiPaths.contacts, contact);
      alert('Mensagem de contato enviada com sucesso!');
      setName(''); setEmail('');
      setSubject(''); setMessage('');
    } catch (failure) { setError(errorMessage(failure)); }
    finally { setSubmitting(false); }
  };

  return (
    <section className="max-w-3xl p-8 mx-auto mt-8 bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Contato</h2>
      <form className="flex flex-col" onSubmit={handleSubmit}>

        <TextField
          required={true}
          label="Nome" maxLength={255}
          placeholder="Digite seu nome"
          value={name}
          onChange={value => setName(value)}
        />

        <TextField
          required={true}
          label="Email" type="email" maxLength={254}
          placeholder="Digite seu email"
          value={email}
          onChange={value => setEmail(value)}
        />

        <TextField
          required={true}
          label="Assunto" maxLength={255}
          placeholder="Digite o assunto"
          value={subject}
          onChange={value => setSubject(value)}
        />

        <TextField
          required={true}
          label="Mensagem" maxLength={10000}
          placeholder="Digite a mensagem"
          value={message}
          onChange={value => setMessage(value)}
        />

        {error && <p role="alert" className="text-red-600">{error}</p>}
        <FormButton disabled={submitting}>
          Manda pra nóis!
        </FormButton>
      </form>
    </section>
  );
};

export default ContactForm;

