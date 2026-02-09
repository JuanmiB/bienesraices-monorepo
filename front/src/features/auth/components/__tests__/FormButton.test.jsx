import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import FormButton from '../FormButton';

describe('FormButton', () => {
  describe('Renderizado', () => {
    it('debe renderizar un botón', () => {
      render(<FormButton label="Click me" />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('debe mostrar el label proporcionado', () => {
      render(<FormButton label="Submit Form" />);

      expect(screen.getByText('Submit Form')).toBeInTheDocument();
    });

    it('debe tener type="submit" por defecto', () => {
      render(<FormButton label="Submit" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('debe usar el type proporcionado', () => {
      render(<FormButton label="Reset" type="reset" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });

    it('debe usar type="button" cuando se especifica', () => {
      render(<FormButton label="Cancel" type="button" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Estado de carga', () => {
    it('debe mostrar "Cargando..." cuando isLoading es true', () => {
      render(<FormButton label="Submit" isLoading={true} />);

      expect(screen.getByText('Cargando...')).toBeInTheDocument();
      expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    });

    it('debe mostrar el label normal cuando isLoading es false', () => {
      render(<FormButton label="Submit" isLoading={false} />);

      expect(screen.getByText('Submit')).toBeInTheDocument();
      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    });

    it('debe estar deshabilitado cuando isLoading es true', () => {
      render(<FormButton label="Submit" isLoading={true} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('debe estar habilitado cuando isLoading es false', () => {
      render(<FormButton label="Submit" isLoading={false} />);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('debe estar habilitado por defecto', () => {
      render(<FormButton label="Submit" />);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Estilos y clases', () => {
    it('debe tener clases base correctas', () => {
      render(<FormButton label="Submit" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full', 'py-2.5', 'rounded-lg', 'font-semibold', 'text-white');
    });

    it('debe tener clases de color primario cuando no está cargando', () => {
      render(<FormButton label="Submit" isLoading={false} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary-600');
    });

    it('debe tener clases de loading cuando isLoading es true', () => {
      render(<FormButton label="Submit" isLoading={true} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary-400', 'cursor-not-allowed');
    });

    it('debe tener clases de hover cuando no está cargando', () => {
      render(<FormButton label="Submit" isLoading={false} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-primary-700');
    });
  });

  describe('Interacciones', () => {
    it('debe ser clickeable cuando no está cargando', () => {
      render(<FormButton label="Submit" isLoading={false} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      // El botón no tiene onClick propio, pero debe ser clickeable
      expect(button).not.toBeDisabled();
    });

    it('no debe ser clickeable cuando está cargando', () => {
      render(<FormButton label="Submit" isLoading={true} />);

      const button = screen.getByRole('button');

      // Intentar hacer click
      fireEvent.click(button);

      // Debe estar deshabilitado
      expect(button).toBeDisabled();
    });

    it('debe cambiar de estado normal a loading', () => {
      const { rerender } = render(
        <FormButton label="Submit" isLoading={false} />
      );

      expect(screen.getByText('Submit')).toBeInTheDocument();
      expect(screen.getByRole('button')).not.toBeDisabled();

      rerender(<FormButton label="Submit" isLoading={true} />);

      expect(screen.getByText('Cargando...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('debe cambiar de loading a estado normal', () => {
      const { rerender } = render(
        <FormButton label="Submit" isLoading={true} />
      );

      expect(screen.getByText('Cargando...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();

      rerender(<FormButton label="Submit" isLoading={false} />);

      expect(screen.getByText('Submit')).toBeInTheDocument();
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  describe('Accesibilidad', () => {
    it('debe ser accesible por role', () => {
      render(<FormButton label="Submit" />);

      const button = screen.getByRole('button', { name: 'Submit' });
      expect(button).toBeInTheDocument();
    });

    it('debe ser accesible por texto cuando está cargando', () => {
      render(<FormButton label="Submit" isLoading={true} />);

      const button = screen.getByRole('button', { name: 'Cargando...' });
      expect(button).toBeInTheDocument();
    });

    it('debe tener el atributo disabled correctamente', () => {
      const { rerender } = render(
        <FormButton label="Submit" isLoading={false} />
      );

      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled', '');
      expect(button.disabled).toBe(false);

      rerender(<FormButton label="Submit" isLoading={true} />);

      button = screen.getByRole('button');
      expect(button.disabled).toBe(true);
    });
  });

  describe('Variaciones de labels', () => {
    it('debe funcionar con labels cortos', () => {
      render(<FormButton label="OK" />);
      expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('debe funcionar con labels largos', () => {
      const longLabel = 'Enviar formulario de registro completo';
      render(<FormButton label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('debe funcionar con labels con caracteres especiales', () => {
      render(<FormButton label="Iniciar Sesión →" />);
      expect(screen.getByText('Iniciar Sesión →')).toBeInTheDocument();
    });

    it('debe funcionar con labels en mayúsculas', () => {
      render(<FormButton label="ENVIAR" />);
      expect(screen.getByText('ENVIAR')).toBeInTheDocument();
    });
  });

  describe('Diferentes tipos de botón', () => {
    it('debe funcionar como botón de submit en formularios', () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <FormButton label="Submit" type="submit" />
        </form>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('debe funcionar como botón de reset', () => {
      render(<FormButton label="Reset" type="reset" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });

    it('debe funcionar como botón normal', () => {
      render(<FormButton label="Click" type="button" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Casos extremos', () => {
    it('debe manejar isLoading undefined', () => {
      render(<FormButton label="Submit" />);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('debe manejar cambios rápidos de estado', () => {
      const { rerender } = render(
        <FormButton label="Submit" isLoading={false} />
      );

      // Cambiar rápidamente entre estados
      rerender(<FormButton label="Submit" isLoading={true} />);
      rerender(<FormButton label="Submit" isLoading={false} />);
      rerender(<FormButton label="Submit" isLoading={true} />);
      rerender(<FormButton label="Submit" isLoading={false} />);

      expect(screen.getByText('Submit')).toBeInTheDocument();
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('debe mantener el type cuando cambia isLoading', () => {
      const { rerender } = render(
        <FormButton label="Reset" type="reset" isLoading={false} />
      );

      rerender(<FormButton label="Reset" type="reset" isLoading={true} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });
  });
});
