// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './auth-context';
import App from './MainApp';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);