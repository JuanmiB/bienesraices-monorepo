import { useEffect, useState, createContext, useContext } from "react";
import PropTypes from "prop-types";
import * as authService from "@features/auth/services";
import { ERROR_MESSAGES } from "@bienesraices/shared-utils/constants";

export const AuthContext = createContext();

const mapUser = (user) => {
    const { name, sub: id, avatarUrl, foto } = user;
    return { name, id, avatarUrl, foto };
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const userData = await authService.login(email, password);
            setIsAuthenticated(true);
            setError(null);
            setUser(userData);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await authService.logout();
            setIsAuthenticated(false);
            setUser(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const register = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const userData = await authService.register(payload);
            setUser(userData);
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const recoverPassword = async (email) => {
        try {
            await authService.recoverPassword(email);
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (newPassword, token) => {
        setLoading(true);
        try {
            await authService.resetPassword(token, newPassword);
            setIsAuthenticated(false);
        } catch (err) {
            setError(err.response ? err.response.data : ERROR_MESSAGES.SERVER_ERROR);
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = async () => {
        try {
            const verifiedUser = await authService.verify();
            setIsAuthenticated(true);
            setUser(mapUser(verifiedUser));
        } catch {
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        const verifyAuth = async () => {
            setLoading(true);
            try {
                const verifiedUser = await authService.verify();
                setIsAuthenticated(true);
                setUser(mapUser(verifiedUser));
            } catch {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        verifyAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, error, setError, recoverPassword, resetPassword, register, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
