import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    role: string | null;
    loading: boolean;
    login: (email: string, password?: string, remember?: boolean) => Promise<boolean>;
    logout: () => void;
    register: (user: User) => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedUser = localStorage.getItem('jcbc_user');
                const rememberCreds = localStorage.getItem('jcbc_remember_creds');

                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else if (rememberCreds) {
                    try {
                        const { email } = JSON.parse(rememberCreds);
                        const allUsers = await api.getUsers();
                        const found = allUsers.find((u: User) => u.email === email);
                        if (found) {
                            setUser(found);
                            localStorage.setItem('jcbc_user', JSON.stringify(found));
                        } else if (email === 'joshuadavidpreach@icloud.com') {
                            const master: User = {
                                id: 'master-admin',
                                email,
                                name: 'Pastor Joshua David',
                                role: 'pastor',
                                isOptedInChat: true,
                                isEnrolled: true
                            };
                            setUser(master);
                            localStorage.setItem('jcbc_user', JSON.stringify(master));
                        }
                    } catch (e) { }
                }
            } catch (error) {
                console.error("Auth initialization failed", error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password?: string, remember: boolean = false): Promise<boolean> => {
        // In a real app, we'd call api.login(email, password)
        // For now, we simulate finding the user
        const allUsers = await api.getUsers();
        let found = allUsers.find(u => u.email === email);

        // Hardcoded master restore logic preserved
        if (!found && email === 'joshuadavidpreach@icloud.com') {
            found = {
                id: 'master-admin',
                email,
                name: 'Pastor Joshua David',
                role: 'pastor',
                isOptedInChat: true,
                isEnrolled: true
            };
        }

        if (found) {
            setUser(found);
            localStorage.setItem('jcbc_user', JSON.stringify(found));
            if (remember) {
                localStorage.setItem('jcbc_remember_creds', JSON.stringify({ email }));
            }
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('jcbc_user');
        localStorage.removeItem('jcbc_remember_creds');
    };

    const register = async (newUser: User) => {
        await api.saveUser(newUser);
        setUser(newUser);
        localStorage.setItem('jcbc_user', JSON.stringify(newUser));
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('jcbc_user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        loading,
        login,
        logout,
        register,
        updateUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
