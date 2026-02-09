import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@features/auth/context';
import { AuthForm } from "@features/auth/components";
import { FormInput } from "@features/auth/components";
import { FormButton } from "@features/auth/components";

const RegisterPage = () => {
  const { register, error, setError, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (validationError) setValidationError(null);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setValidationError('Mínimo 8 caracteres, una mayúscula y un número');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }

    try {
      await register({ email, name, lastName, password });
      setIsSuccess(true)
    } catch {
      // error mostrado via contexto
    }
  };

  return (
    <AuthForm title="Crear Cuenta" onSubmit={handleSubmit}>
    {isSuccess ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-green-600 mb-2">
            ¡Solicitud Enviada!
          </h2>
          <p className="text-sm text-gray-500">
            Hemos enviado un email de verificación a tu correo.
            Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
          </p>
          <Link to="/auth/acceder" className="inline-block mt-5 text-primary-600 hover:underline font-medium text-sm">
            Ir a Iniciar Sesión
          </Link>
        </div>
      ) : (
      <>
      <div className="h-5">
        <p className={`text-red-500 text-sm ${validationError || error?.response?.data?.message ? 'block' : 'hidden'}`}>
          {validationError || error?.response?.data?.message || 'Error al registrar'}
        </p>
      </div>
      <FormInput
        type="text"
        id="name"
        label="Nombre"
        placeholder="Tu nombre"
        value={name}
        onChange={handleChange(setName)}
        />
      <FormInput
        type="text"
        id="lastName"
        label="Apellido"
        placeholder="Tu apellido"
        value={lastName}
        onChange={handleChange(setLastName)}
        />
      <FormInput
        type="email"
        id="email"
        label="Email"
        placeholder="email@ejemplo.com"
        value={email}
        onChange={handleChange(setEmail)}
        />
      <FormInput
        type="password"
        id="password"
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChange={handleChange(setPassword)}
        hint="Mínimo 8 caracteres, una mayúscula y un número"
        />
      <FormInput
        type="password"
        id="confirmPassword"
        label="Confirmar Contraseña"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={handleChange(setConfirmPassword)}
        />
      <FormButton label="Registrar" isLoading={loading} />
      <p className="text-sm text-gray-500 text-center">
        ¿Ya tenés cuenta?{' '}
        <Link to="/auth/acceder" className="text-primary-600 hover:underline">
          Ingresa aquí
        </Link>
      </p>
        </>
      )}
    </AuthForm>
  );
};

export default RegisterPage;
