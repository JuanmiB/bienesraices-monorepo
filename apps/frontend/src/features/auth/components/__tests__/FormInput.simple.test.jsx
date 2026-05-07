import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import FormInput from '../FormInput';

describe('FormInput - Tests Funcionales', () => {
  it('debe renderizar un input básico', () => {
    const onChange = vi.fn();
    render(<FormInput value="" onChange={onChange} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('debe mostrar el valor proporcionado', () => {
    const onChange = vi.fn();
    render(<FormInput value="test value" onChange={onChange} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test value');
  });

  it('debe llamar onChange cuando el usuario escribe', () => {
    const onChange = vi.fn();
    render(<FormInput value="" onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'nuevo texto' } });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('debe mostrar placeholder cuando se proporciona', () => {
    const onChange = vi.fn();
    render(
      <FormInput
        value=""
        onChange={onChange}
        placeholder="Ingresa tu email"
      />
    );

    expect(screen.getByPlaceholderText('Ingresa tu email')).toBeInTheDocument();
  });

  it('debe renderizar con label', () => {
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

  it('debe tener el atributo required', () => {
    const onChange = vi.fn();
    render(<FormInput value="" onChange={onChange} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('debe usar type="email" cuando se especifica', () => {
    const onChange = vi.fn();
    render(<FormInput type="email" value="" onChange={onChange} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });
});
