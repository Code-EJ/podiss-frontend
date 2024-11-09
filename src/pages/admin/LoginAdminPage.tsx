// src/pages/admin/LoginAdminPage.tsx
import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../../auth-context';

const LoginAdminPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Pega aquela rota original que o usuário tentou acessar
  const from = (location.state as any)?.from?.pathname || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
      const token = response.data.token;
      login(token);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-700 to-red-500">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Usuário</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full p-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="text-gray-700">Lembrar Senha</label>
          </div>
          <button type="submit" className="w-full bg-red-500 text-white font-bold py-2 rounded">
            Login
          </button>
        </form>

        {/* Exibe a mensagem de erro, se houver */}
        {error && ( // Alterado de errorMessage para error
          <p className="mt-4 text-center text-red-500">
            {error}
          </p>
        )}

        <p className="mt-4 text-center text-gray-600">
          
          <a href="/register" className="text-pink-500 hover:underline">
           
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginAdminPage; 
