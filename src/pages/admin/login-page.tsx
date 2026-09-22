// src/pages/admin/AdminLoginPage.tsx
import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api, { errorMessage } from '../../api';

import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../../auth-context';


/**
 * Authenticates credentials then verifies administrator access before entering the panel. Remember stores a token, never a password.
 * @author oEnzoRibas
 */
const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Pega aquela rota original que o usuário tentou acessar
  const state = location.state as { from?: { pathname?: string } } | null;
  const target = state?.from?.pathname ?? '/admin';
  const from = /^\/admin(?:\/[a-z-]+)*$/.test(target) ? target : '/admin';
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true); setError(null);
    try {
      const response = await api.post<{ token: string }>('/api/auth/login', { username, password });
      const token = response.data.token;
      await login(token, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally { setSubmitting(false); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-700 to-red-500">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="login-username" className="block text-gray-700">Usuário</label>
            <input
              id="login-username" autoComplete="username" type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="login-password" className="block text-gray-700">Senha</label>
            <div className="relative">
              <input
                id="login-password" autoComplete="current-password" type={showPassword ? 'text' : 'password'}
                className="w-full p-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="remember-login" type="checkbox"
              className="mr-2"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-login" title="Mantém apenas o token neste navegador; não salva a senha." className="text-gray-700">Lembrar Senha</label>
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-red-500 text-white font-bold py-2 rounded">
            Login
          </button>
        </form>


        {error && (
          <p role="alert" className="mt-4 text-center text-red-500">
            {error}
          </p>
        )}


      </div>
    </div>
  );
};

export default AdminLoginPage;
