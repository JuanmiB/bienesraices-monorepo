import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import FormInput from '../FormInput';

describe('FormInput', () => {
  describe('Renderizado', () => {
    it('debe renderizar un input básico', () => {
      const onChange = vi.fn();
      render(<FormInput value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('debe renderizar con el valor proporcionado', () => {
      const onChange = vi.fn();
      render(<FormInput value="test value" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('test value');
    });

    it('debe renderizar con placeholder', () => {
      const onChange = vi.fn();
      render(
        <FormInput
          value=""
          onChange={onChange}
          placeholder="Enter text"
        />
      );

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('debe renderizar con label cuando se proporciona', () => {
      const onChange = vi.fn();
      render(
        <FormInput
          value=""
          onChange={onChange}
          label="Email"
          id="email"
        />
      );

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('debe renderizar con hint cuando se proporciona', () => {
      const onChange = vi.fn();
      render(
        <FormInput
          value=""
          onChange={onChange}
          hint="Ingresa tu email"
        />
      );

      expect(screen.getByText('Ingresa tu email')).toBeInTheDocument();
    });
  });

  describe('Tipos de input', () => {
    it('debe usar type="text" por defecto', () => {
      const onChange = vi.fn();
      render(<FormInput value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('debe usar type="email" cuando se especifica', () => {
      const onChange = vi.fn();
      render(<FormInput type="email" value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('debe usar type="password" cuando se especifica', () => {
      const onChange = vi.fn();
      render(<FormInput type="password" value="" onChange={onChange} />);

      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Interacciones', () => {
    it('debe llamar a onChange cuando el usuario escribe', () => {
      const onChange = vi.fn();
      render(<FormInput value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'nuevo valor' } });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('debe pasar el evento correcto a onChange', () => {
      const onChange = vi.fn();
      render(<FormInput value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'test'
          })
        })
      );
    });

    it('debe actualizar el valor cuando cambia la prop', () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <FormInput value="inicial" onChange={onChange} />
      );

      expect(screen.getByRole('textbox')).toHaveValue('inicial');

      rerender(<FormInput value="actualizado" onChange={onChange} />);

      expect(screen.getByRole('textbox')).toHaveValue('actualizado');
    });
  });

  describe('Atributos HTML', () => {
    it('debe tener el atributo required', () => {
      const onChange = vi.fn();
      render(<FormInput value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('debe tener el id correcto cuando se proporciona', () => {
      const onChange = vi.fn();
      render(<FormInput value="" onChange={onChange} id="test-input" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'test-input');
    });

    it('debe asociar label con input usando htmlFor e id', () => {
      const onChange = vi.fn();
      render(
        <FormInput
          value=""
          onChange={onChange}
          label="Username"
          id="username"
        />
      );

      const label = screen.getByText('Username');
      const input = screen.getByLabelText('Username');

      expect(label).toHaveAttribute('for', 'username');
      expect(input).toHaveAttribute('id', 'username');
    });
  });

  describe('Estilos y clases', () => {
    it('debe tener las clases CSS correctas', () => {
      const onChange = vi.fn();
      render(<FormInput value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('block', 'w-full', 'px-4', 'py-2.5', 'rounded-lg');
    });

    it('debe tener clases de borde y fondo', () => {
      const onChange = vi.fn();
      render(<FormInput value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border', 'border-gray-200', 'bg-gray-50');
    });
  });

  describe('Accesibilidad', () => {
    it('debe ser accesible con label', () => {
      const onChange = vi.fn();
      render(
        <FormInput
          value=""
          onChange={onChange}
          label="Email Address"
          id="email"
        />
      );

      // Verificar que el input es accesible por su label
      const input = screen.getByLabelText('Email Address');
      expect(input).toBeInTheDocument();
    });

    it('debe tener placeholder accesible', () => {
      const onChange = vi.fn();
      render(
        <FormInput
          value=""
          onChange={onChange}
          placeholder="username@example.com"
        />
      );

      const input = screen.getByPlaceholderText('username@example.com');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Casos extremos', () => {
    it('debe manejar valores vacíos', () => {
      const onChange = vi.fn();
      render(<FormInput value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('debe manejar valores largos', () => {
      const onChange = vi.fn();
      const longValue = 'a'.repeat(1000);
      render(<FormInput value={longValue} onChange={onChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue(longValue);
    });

    it('debe manejar caracteres especiales', () => {
      const onChange = vi.fn();
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      render(<FormInput value={specialChars} onChange={onChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue(specialChars);
    });

    it('debe funcionar sin label', () => {
      const onChange = vi.fn();
      render(<FormInput value="test" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('debe funcionar sin hint', () => {
      const onChange = vi.fn();
      render(<FormInput value="test" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
  });
});
