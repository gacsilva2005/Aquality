import { createContext, useContext, useState, type ReactNode } from 'react';

interface Clube {
    id: number;
    nome: string;
    codigo?: string;
}

interface User {
    id: number;
    nome: string;
    email: string;
    telefone?: string;
    cargo?: string;
    clube?: Clube;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {}
});

export function UserProvider({ children }: { children: ReactNode }) {

    const [user, setUserState] = useState<User | null>(() => {
        const usuarioSalvo = localStorage.getItem("usuarioLogado");

        if (usuarioSalvo) {
            return JSON.parse(usuarioSalvo);
        }

        return null;
    });

    const setUser = (user: User | null) => {
        setUserState(user);

        if (user) {
            localStorage.setItem("usuarioLogado", JSON.stringify(user));
        } else {
            localStorage.removeItem("usuarioLogado");
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}