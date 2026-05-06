import { useEffect, useState, useCallback, useMemo, createContext, useContext } from "react";
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

    const refreshUser = useCallback(async () => {
        try {
            const verifiedUser = await authService.verify();
            setIsAuthenticated(true);
            setUser(mapUser(verifiedUser));
            return true;
        } catch {
            setIsAuthenticated(false);
            return false;
        }
    }, []);

    const login = useCallback(async (email, password) => {
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
    }, []);

    const logout = useCallback(async () => {
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
    }, []);

    const register = useCallback(async (payload) => {
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
    }, []);

    const recoverPassword = useCallback(async (email) => {
        try {
            await authService.recoverPassword(email);
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const resetPassword = useCallback(async (newPassword, token) => {
        setLoading(true);
        try {
            await authService.resetPassword(token, newPassword);
            setIsAuthenticated(false);
        } catch (err) {
            setError(err.response ? err.response.data : ERROR_MESSAGES.SERVER_ERROR);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        refreshUser().finally(() => setLoading(false));
    }, [refreshUser]);

    const value = useMemo(() => ({
        isAuthenticated,
        user,
        loading,
        error,
        setError,
        login,
        logout,
        register,
        recoverPassword,
        resetPassword,
        refreshUser,
    }), [isAuthenticated, user, loading, error, login, logout, register, recoverPassword, resetPassword, refreshUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
