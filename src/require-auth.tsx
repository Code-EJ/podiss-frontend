import { routes } from './navigation/routes';
// src/require-auth.tsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './auth-context';

interface RequireAuthProps {
  children: JSX.Element;
}

/**
 * Waits for server-backed administrator verification before rendering protected children.
 * @author oEnzoRibas
 */
const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isLoggedIn, isChecking } = useContext(AuthContext);
  const location = useLocation();

  if (isChecking) return <p role="status">Verificando sessão...</p>;
  if (!isLoggedIn) {
    return <Navigate to={routes.login} state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
