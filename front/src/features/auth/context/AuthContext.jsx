import { useEffect, useState, createContext, useContext } from "react";
import PropTypes from "prop-types";
import { api } from "@shared/services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const login = async (email, password) => {
        setLoading(true)
        try {
            const response = await api.post(
                '/api/v1/auth/login',
                { email, password }
            );
            setIsAuthenticated(true);
            setError(false)
            setUser(response?.data?.user);
        } catch (error) {
            setError(error)
        } finally{
            setLoading(false)
        }
    };

    const logout = async () => {
        setLoading(true)
        try {
            await api.post('/api/v1/auth/logout');
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    };

    const register = async({name, lastName, email, password}) => {
        setLoading(true);
        setError(false)
        try {
            const response = await api.post(
                '/api/v1/auth/register', { firstname: name, lastName, email, password}
            )
            setUser(response?.data?.user)
        } catch (error) {
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const recoverPassword = async (email) => {
        try {
            await api.post('/api/v1/auth/password/recover', {email})
        } catch (error) {
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const resetPassword = async (newPassword, token) => {
        setLoading(true);
        try {
          await api.post(`/api/v1/auth/password/reset/${token}`, {
            password: newPassword
          });
          setIsAuthenticated(false);
        } catch (error) {
          setError(error.response ? error.response.data : 'Error desconocido');
        } finally {
          setLoading(false);
        }
      };

      const refreshUser = async () => {
        try {
            const response = await api.get('/api/v1/auth/verify');
            setIsAuthenticated(true);
            const { name, sub: id, avatarUrl, foto } = response.data.user;
            setUser({ name, id, avatarUrl, foto });
        } catch {
            setIsAuthenticated(false);
        }
    };

      useEffect(() => {
        const verifyAuth = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/v1/auth/verify');

                setIsAuthenticated(true);
                const { name, sub: id, avatarUrl, foto } = response.data.user;
                setUser({ name, id, avatarUrl, foto });
            } catch {

                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading ,error, setError, recoverPassword, resetPassword, register, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export const useAuth = () => useContext(AuthContext);
