import React, { createContext, useState, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Kit {
    id: number;
    nome: string;
    modalidade: string;
    pesoTotal: number; // em gramas
}

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
    fotoPerfil?: string | null;
    sexo?: string;
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
    kitPrincipalId?: number | null;
}

interface UserContextData {
    user: UserData | null;
    setUser: (user: UserData | null) => void;

    profileImage: string | null;
    setProfileImage: (uri: string | null) => void;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<UserData | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const setUser = async (newUser: UserData | null) => {
        setUserState(newUser);
        if (newUser) {
            if (newUser.fotoPerfil) {
                setProfileImage(newUser.fotoPerfil);
                try {
                    await AsyncStorage.setItem(`@profile_image_${newUser.id}`, newUser.fotoPerfil);
                } catch (e) {
                    console.log('Erro ao salvar imagem no AsyncStorage:', e);
                }
            } else {
                try {
                    const localImage = await AsyncStorage.getItem(`@profile_image_${newUser.id}`);
                    if (localImage) {
                        setProfileImage(localImage);
                    } else {
                        setProfileImage(null);
                    }
                } catch (e) {
                    setProfileImage(null);
                }
            }
        } else {
            setProfileImage(null);
        }
    };

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