import { createContext, useState, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Use lazy initializer so we don't call setUser inside an effect synchronously
    const [user, setUser] = useState(() => authService.getCurrentUser());

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser(data.user);
        return data;
    };

    const register = async (email, password) => {
        const data = await authService.register(email, password);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const forgotPassword = async (email) => {
        return await authService.forgotPassword(email);
    };

    const resetPassword = async (email, code, password) => {
        return await authService.resetPassword(email, code, password);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
