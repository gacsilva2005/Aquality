import React, { createContext, useState, useContext, ReactNode } from 'react';

// Tipagem do que o nosso contexto vai guardar
interface UserContextData {
  profileImage: string | null;
  setProfileImage: (uri: string | null) => void;
  userName: string;
  setUserName: (name: string) => void;
}

// Criando o contexto
const UserContext = createContext<UserContextData>({} as UserContextData);

// Criando o Provedor que vai "abraçar" o app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('Nome de Usuário');

  return (
    <UserContext.Provider value={{ profileImage, setProfileImage, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto em outras telas
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};