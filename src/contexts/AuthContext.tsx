import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
    id: string;
    username: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<any>;
    register: (username: string, password: string) => Promise<any>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await authAPI.login(username, password);

            if (response.success) {
                const { token: newToken, user: newUser } = response;

                setToken(newToken);
                setUser(newUser);

                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));
                return response;
            } else {
                throw new Error(response.message || 'Falha no login');
            }
        } catch (error: any) {
            // Enhanced error propagation
            const serverMessage = error.response?.data?.message;
            const err = new Error(serverMessage || 'Erro ao fazer login');
            (err as any).code = error.code;
            (err as any).status = error.response?.status;
            throw err;
        }
    };

    const register = async (username: string, password: string) => {
        try {
            const response = await authAPI.register(username, password);

            if (response.success) {
                const { token: newToken, user: newUser } = response;

                setToken(newToken);
                setUser(newUser);

                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));
                return response;
            } else {
                throw new Error(response.message || 'Falha no registro');
            }
        } catch (error: any) {
            // Enhanced error propagation
            const serverMessage = error.response?.data?.message;
            const err = new Error(serverMessage || 'Erro ao registrar');
            (err as any).code = error.code;
            (err as any).status = error.response?.status;
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
