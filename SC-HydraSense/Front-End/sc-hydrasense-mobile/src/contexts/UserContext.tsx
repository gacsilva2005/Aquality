import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserData {
    dataNascimento: string;
    id?: number;
    nome: string;
    email: string;
    perfil?: string;
    equipe?: string;
    time?: string;
    peso?: string;
    altura?: string;
    idade?: string;
    profileImage?: string | null;
    pesoAtual?: string; 
    modalidade?: string;
    clube?: { 
        id?: number;
        nome: string; 
        codigo?: string;
    } | null;
    registro?: string;
    especialidade?: string;
    codigoEquipe?: string;
}

interface UserContextData {
    user: UserData | null;
    setUser: (user: UserData | null) => void;

    profileImage: string | null;
    setProfileImage: (uri: string | null) => void;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);

    const [profileImage, setProfileImage] = useState<string | null>(null);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                profileImage,
                setProfileImage,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};