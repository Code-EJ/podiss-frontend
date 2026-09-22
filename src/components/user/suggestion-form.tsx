import { apiPaths } from '../../services/api-paths';
import React, { useState } from 'react';
import FormButton from './form-button';
import TextField from './text-field';
import api, { errorMessage } from '../../api';
import type { SuggestionPayload } from '../../types/api';

/**
 * Submits a public topic suggestion. Personal data is never written to application logs.
 * @author oEnzoRibas
 */
const SuggestionForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [theme, setTheme] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true); setError(null);

    const suggestion: SuggestionPayload = {
      nome: name,
      email: email,
      tema: theme,
    };

    try {
      await api.post(apiPaths.suggestions, suggestion);
      alert('Sugestão enviada com sucesso! Obrigado por contribuir!');
      setName(''); setEmail('');
      setTheme('');
    } catch (failure) { setError(errorMessage(failure)); }
    finally { setSubmitting(false); }
  };

  return (
    <section className="max-w-3xl p-8 mx-auto mt-8 bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Sugira um Tema</h2>
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
          label="Tema" maxLength={2000}
          placeholder="Digite o tema"
          value={theme}
          onChange={value => setTheme(value)}
        />

        {error && <p role="alert" className="text-red-600">{error}</p>}
        <FormButton disabled={submitting}>
          Manda pra nóis!
        </FormButton>

      </form>
    </section>
  );
};

export default SuggestionForm;
