import { contentService } from '../../services/content-service';
import { useAsyncAction } from '../../hooks/use-async-action';
import { Alert } from '../ui/alert';
import React, { useState } from 'react';
import FormButton from './form-button';
import TextField from './text-field';
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

  const { busy: submitting, error, run } = useAsyncAction();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    const contact: ContactPayload = {
      nome: name,
      email: email,
      assunto: subject,
      mensagem: message
    };

    const result = await run(() => contentService.contact(contact), { loading: 'Registrando mensagem...', success: 'Mensagem registrada com sucesso!' });
    if (result.ok) { setName(''); setEmail(''); setSubject(''); setMessage(''); }
  };

  return (
    <section className="w-full max-w-3xl p-5 sm:p-8 mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Contato</h2>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <fieldset disabled={submitting} className="min-w-0">

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

        <Alert message={error} />
        <FormButton loading={submitting}>
          Manda pra nóis!
        </FormButton>
        </fieldset>
      </form>
    </section>
  );
};

export default ContactForm;

