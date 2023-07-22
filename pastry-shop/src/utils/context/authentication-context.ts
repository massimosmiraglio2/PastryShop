import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  token: '',
  login: (token: string, expirationDate?: Date) => {},
  logout: () => {},
});
