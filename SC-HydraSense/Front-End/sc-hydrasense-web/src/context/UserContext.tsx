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

    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}