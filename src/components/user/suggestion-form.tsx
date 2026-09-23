import { contentService } from '../../services/content-service';
import { useAsyncAction } from '../../hooks/use-async-action';
import { Alert } from '../ui/alert';
import React, { useState } from 'react';
import FormButton from './form-button';
import TextField from './text-field';
import type { SuggestionPayload } from '../../types/api';

/**
 * Submits a public topic suggestion. Personal data is never written to application logs.
 * @author oEnzoRibas
 */
const SuggestionForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [theme, setTheme] = useState<string>('');

  const { busy: submitting, error, run } = useAsyncAction();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    const suggestion: SuggestionPayload = {
      nome: name,
      email: email,
      tema: theme,
    };

    const result = await run(() => contentService.suggest(suggestion), { loading: 'Registrando sugestão...', success: 'Sugestão registrada com sucesso!' });
    if (result.ok) { setName(''); setEmail(''); setTheme(''); }
  };

  return (
    <section className="w-full max-w-3xl p-5 sm:p-8 mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Sugira um Tema</h2>
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
          label="Tema" maxLength={2000}
          placeholder="Digite o tema"
          value={theme}
          onChange={value => setTheme(value)}
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

export default SuggestionForm;
