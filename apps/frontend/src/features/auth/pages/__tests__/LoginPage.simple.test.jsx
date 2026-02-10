import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import React from 'react';
import LoginPage from '../LoginPage';

describe('LoginPage - Tests Simplificados', () => {
  describe('Renderizado Básico', () => {
    it('debe renderizar el formulario de login', () => {
      const mockLogin = vi.fn();

      renderWithProviders(<LoginPage />, {
        authValue: {
          login: mockLogin,
          isAuthenticated: false,
          error: null,
          setError: vi.fn(),
          loading: false,
        },
      });

      // Verificar que el formulario se renderiza
      expect(screen.getByText(/ingresa a tu cuenta/i)).toBeInTheDocument();
    });

    it('debe tener campos de email y password', () => {
      renderWithProviders(<LoginPage />, {
        authValue: {
          login: vi.fn(),
          isAuthenticated: false,
          error: null,
          setError: vi.fn(),
          loading: false,
        },
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });
  });

  describe('Interacciones', () => {
    it('debe permitir escribir en los campos', () => {
      renderWithProviders(<LoginPage />, {
        authValue: {
          login: vi.fn(),
          isAuthenticated: false,
          error: null,
          setError: vi.fn(),
          loading: false,
        },
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(emailInput).toHaveValue('test@test.com');
      expect(passwordInput).toHaveValue('password123');
    });

    it('debe llamar a login al hacer submit', async () => {
      const mockLogin = vi.fn();

      renderWithProviders(<LoginPage />, {
        authValue: {
          login: mockLogin,
          isAuthenticated: false,
          error: null,
          setError: vi.fn(),
          loading: false,
        },
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123');
      });
    });
  });

  describe('Manejo de Estados', () => {
    it('debe mostrar error cuando existe', () => {
      renderWithProviders(<LoginPage />, {
        authValue: {
          login: vi.fn(),
          isAuthenticated: false,
          error: {
            response: {
              data: {
                message: 'Credenciales incorrectas',
              },
            },
          },
          setError: vi.fn(),
          loading: false,
        },
      });

      expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
    });

    it('debe mostrar estado de carga', () => {
      renderWithProviders(<LoginPage />, {
        authValue: {
          login: vi.fn(),
          isAuthenticated: false,
          error: null,
          setError: vi.fn(),
          loading: true,
        },
      });

      expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    });
  });

  describe('Navegación', () => {
    it('debe tener links a otras páginas', () => {
      renderWithProviders(<LoginPage />, {
        authValue: {
          login: vi.fn(),
          isAuthenticated: false,
          error: null,
          setError: vi.fn(),
          loading: false,
        },
      });

      const recoverLink = screen.getByText(/recupérala aquí/i);
      const registerLink = screen.getByText(/registráte aquí/i);

      expect(recoverLink.closest('a')).toHaveAttribute('href', '/auth/recuperar-contraseña');
      expect(registerLink.closest('a')).toHaveAttribute('href', '/auth/crear-cuenta');
    });
  });
});
