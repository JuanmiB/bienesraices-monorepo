import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import FormButton from '../FormButton';

describe('FormButton - Tests Funcionales', () => {
  it('debe renderizar el botón con el label correcto', () => {
    render(<FormButton label="Enviar" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Enviar');
  });

  it('debe mostrar "Cargando..." cuando isLoading es true', () => {
    render(<FormButton label="Enviar" isLoading={true} />);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.queryByText('Enviar')).not.toBeInTheDocument();
  });

  it('debe estar deshabilitado cuando isLoading es true', () => {
    render(<FormButton label="Enviar" isLoading={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('debe estar habilitado cuando isLoading es false', () => {
    render(<FormButton label="Enviar" isLoading={false} />);

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('debe ser clickeable', () => {
    render(<FormButton label="Enviar" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // El botón debe seguir en el documento después del click
    expect(button).toBeInTheDocument();
  });

  it('debe tener type="submit" por defecto', () => {
    render(<FormButton label="Enviar" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('debe aceptar diferentes tipos de botón', () => {
    render(<FormButton label="Cancelar" type="button" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
