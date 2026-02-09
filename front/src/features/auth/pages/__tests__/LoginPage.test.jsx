import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mocks globales
const mockLogin = vi.fn();
const mockSetError = vi.fn();
const mockNavigate = vi.fn();

let authContextValue = {
  login: mockLogin,
  isAuthenticated: false,
  error: null,
  setError: mockSetError,
  loading: false,
};

// Mock del contexto de autenticación
vi.mock('@features/auth/context', () => ({
  useAuth: () => authContextValue,
}));

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock de los componentes de auth - Replicando la estructura real
vi.mock('@features/auth/components', () => ({
  AuthForm: ({ children, title, onSubmit }) => {
    return (
      <div data-testid="auth-form">
        <h1>Bienes Raices</h1>
        <div>
          <h2>{title}</h2>
          <form onSubmit={onSubmit}>
            {children}
          </form>
        </div>
      </div>
    );
  },
  FormInput: ({ type = 'text', placeholder, value, onChange, id, label }) => {
    return (
      <div>
        {label && (
          <label htmlFor={id}>
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
        />
      </div>
    );
  },
  FormButton: ({ label, type = 'submit', isLoading }) => {
    return (
      <button
        type={type}
        disabled={isLoading}
      >
        {isLoading ? 'Cargando...' : label}
      </button>
    );
  },
}));

// Importar LoginPage DESPUÉS de los mocks
const { default: LoginPage } = await import('../LoginPage');

// Wrapper para proveer router context
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset auth context to default state
    authContextValue.login = mockLogin;
    authContextValue.isAuthenticated = false;
    authContextValue.error = null;
    authContextValue.setError = mockSetError;
    authContextValue.loading = false;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado inicial', () => {
    it('debe renderizar el título del formulario', () => {
      renderWithRouter(<LoginPage />);
      expect(screen.getByText('Ingresa a tu cuenta')).toBeInTheDocument();
    });

    it('debe renderizar los campos de email y contraseña', () => {
      renderWithRouter(<LoginPage />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    });

    it('debe renderizar el botón de iniciar sesión', () => {
      renderWithRouter(<LoginPage />);
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('debe renderizar los links de navegación', () => {
      renderWithRouter(<LoginPage />);

      const recoverLink = screen.getByText(/recupérala aquí/i);
      const registerLink = screen.getByText(/registráte aquí/i);

      expect(recoverLink).toBeInTheDocument();
      expect(registerLink).toBeInTheDocument();
    });

    it('debe tener los campos vacíos inicialmente', () => {
      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });

  describe('Interacción con inputs', () => {
    it('debe actualizar el campo de email al escribir', () => {
      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('debe actualizar el campo de contraseña al escribir', () => {
      renderWithRouter(<LoginPage />);

      const passwordInput = screen.getByLabelText(/contraseña/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput).toHaveValue('password123');
    });

    it('debe limpiar el error cuando se modifica un input', () => {
      authContextValue.error = {
        response: { data: { message: 'Error de login' } },
      };

      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });

      expect(mockSetError).toHaveBeenCalledWith(null);
    });
  });

  describe('Submit del formulario', () => {
    it('debe llamar a login con las credenciales correctas', async () => {
      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('debe llamar a login incluso con campos vacíos', async () => {
      renderWithRouter(<LoginPage />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('', '');
      });
    });
  });

  describe('Manejo de errores', () => {
    it('debe mostrar el mensaje de error cuando existe', () => {
      authContextValue.error = {
        response: {
          data: {
            message: 'Credenciales inválidas',
          },
        },
      };

      renderWithRouter(<LoginPage />);

      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });

    it('no debe mostrar mensaje de error cuando no hay error', () => {
      renderWithRouter(<LoginPage />);

      const errorElement = screen.queryByText(/credenciales inválidas/i);
      expect(errorElement).not.toBeInTheDocument();
    });
  });

  describe('Estado de carga', () => {
    it('debe mostrar "Cargando..." cuando loading es true', () => {
      authContextValue.loading = true;

      renderWithRouter(<LoginPage />);

      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('debe deshabilitar el botón cuando loading es true', () => {
      authContextValue.loading = true;

      renderWithRouter(<LoginPage />);

      const submitButton = screen.getByRole('button');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Navegación y Links', () => {
    it('debe tener link correcto a recuperar contraseña', () => {
      renderWithRouter(<LoginPage />);

      const recoverLink = screen.getByText(/recupérala aquí/i);
      expect(recoverLink.closest('a')).toHaveAttribute('href', '/auth/recuperar-contraseña');
    });

    it('debe tener link correcto a registro', () => {
      renderWithRouter(<LoginPage />);

      const registerLink = screen.getByText(/registráte aquí/i);
      expect(registerLink.closest('a')).toHaveAttribute('href', '/auth/crear-cuenta');
    });

    it('debe limpiar errores al hacer click en recuperar contraseña', () => {
      renderWithRouter(<LoginPage />);

      const recoverLink = screen.getByText(/recupérala aquí/i);
      fireEvent.click(recoverLink);

      expect(mockSetError).toHaveBeenCalledWith(null);
    });
  });

  describe('Redirección automática', () => {
    it('debe redirigir cuando el usuario está autenticado', async () => {
      authContextValue.isAuthenticated = true;

      renderWithRouter(<LoginPage />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('no debe redirigir cuando el usuario no está autenticado', () => {
      renderWithRouter(<LoginPage />);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Tipos y placeholders de inputs', () => {
    it('debe tener type="email" en el campo de email', () => {
      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('debe tener type="password" en el campo de contraseña', () => {
      renderWithRouter(<LoginPage />);

      const passwordInput = screen.getByLabelText(/contraseña/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('debe tener placeholder en el campo de email', () => {
      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('email@ejemplo.com');
      expect(emailInput).toBeInTheDocument();
    });

    it('debe tener placeholder en el campo de contraseña', () => {
      renderWithRouter(<LoginPage />);

      const passwordInput = screen.getByPlaceholderText('••••••••');
      expect(passwordInput).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener labels asociados correctamente', () => {
      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Contraseña');

      expect(emailInput).toHaveAttribute('id', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });

    it('debe tener un botón submit accesible', () => {
      renderWithRouter(<LoginPage />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
});
