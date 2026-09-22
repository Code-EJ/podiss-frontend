import { createContext } from 'react';
export interface AuthContextType {
  isLoggedIn: boolean; isChecking: boolean; token: string | null;
  login: (token: string, remember?: boolean) => Promise<void>; logout: () => void;
}
/** UI state is not an authorization boundary. @author oEnzoRibas */
export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false, isChecking: true, token: null,
  login: async () => { throw new Error('AuthProvider ausente.'); }, logout: () => {},
});
