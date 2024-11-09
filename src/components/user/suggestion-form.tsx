// src/components/user/SuggestionForm.tsx
import React from 'react';

const SuggestionForm: React.FC = () => {
  return (
    <aside className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sugira um Tema</h2>
      <form className="flex flex-col">
        <label htmlFor="nome" className="mb-2 font-semibold">
          Nome:
        </label>
        <input type="text" id="nome" name="nome" required className="mb-4 p-2 border rounded" />
        <label htmlFor="email" className="mb-2 font-semibold">
          Email:
        </label>
        <input type="email" id="email" name="email" required className="mb-4 p-2 border rounded" />
        <label htmlFor="tema" className="mb-2 font-semibold">
          Sugestão de Tema:
        </label>
        <textarea id="tema" name="tema" required className="mb-4 p-2 border rounded"></textarea>
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Mandá pra nóis!
        </button>
      </form>
    </aside>
  );
};

export default SuggestionForm;
