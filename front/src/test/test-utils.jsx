import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

// Mock del AuthContext Provider
const MockAuthProvider = ({ children, value = {} }) => {
  const defaultValue = {
    login: async () => {},
    logout: () => {},
    isAuthenticated: false,
    user: null,
    error: null,
    setError: () => {},
    loading: false,
    ...value,
  };

  // Crear un contexto mock simple
  const AuthContext = React.createContext(defaultValue);

  return <AuthContext.Provider value={defaultValue}>{children}</AuthContext.Provider>;
};

MockAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.object,
};

// Wrapper que incluye todos los providers necesarios
export const AllTheProviders = ({ children, authValue }) => {
  return (
    <BrowserRouter>
      <MockAuthProvider value={authValue}>{children}</MockAuthProvider>
    </BrowserRouter>
  );
};

AllTheProviders.propTypes = {
  children: PropTypes.node.isRequired,
  authValue: PropTypes.object,
};

// Custom render que incluye los providers
export const renderWithProviders = (
  ui,
  { authValue = {}, ...renderOptions } = {}
) => {
  const Wrapper = ({ children }) => (
    <AllTheProviders authValue={authValue}>{children}</AllTheProviders>
  );

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything from testing library
export * from '@testing-library/react';
