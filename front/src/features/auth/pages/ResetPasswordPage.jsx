import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@features/auth/context';
import { AuthForm } from "@features/auth/components";
import { FormInput } from "@features/auth/components";
import { FormButton } from "@features/auth/components";

const ResetPasswordPage = () => {
  const { resetPassword, error, setError, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false)
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError({ message: 'Mínimo 8 caracteres, una mayúscula y un número' });
      return;
    }

    if (password !== confirmPassword) {
      setError({ message: 'Las contraseñas no coinciden' });
      return;
    }

    try{
        await resetPassword(password, token);
        setIsSuccess(true);
    } catch {
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError(null);
  };

  return (
    <AuthForm title="Restablecer Contraseña" onSubmit={handleSubmit}>
   {isSuccess ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-green-600 mb-2">
            ¡Solicitud Aprobada!
          </h2>
          <p className="text-sm text-gray-500">
            Contraseña restablecida!
          </p>
          <Link to="/auth/acceder" className="inline-block mt-5 text-primary-600 hover:underline font-medium text-sm">
            Ir a Iniciar Sesión
          </Link>
        </div>
      ) : (
        <>
      <div className="h-6">
        <p className={`text-red-500 text-sm ${error?.message ? 'block' : 'hidden'}`}>
          {error?.message}
        </p>
      </div>

      <FormInput
        type="password"
        id="password"
        label="Nueva Contraseña"
        placeholder="••••••••"
        value={password}
        onChange={handleInputChange(setPassword)}
        hint="Mínimo 8 caracteres, una mayúscula y un número"
        />

      <FormInput
        type="password"
        id="confirmPassword"
        label="Confirmar Contraseña"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={handleInputChange(setConfirmPassword)}
        />

      <FormButton label="Restablecer Contraseña" isLoading={loading} />

      <Link to="/auth/acceder" className="block text-center text-primary-600 hover:underline font-medium text-sm mt-4">
        Volver a Iniciar Sesión
      </Link>
            </>
      )}
    </AuthForm>
  );
};

export default ResetPasswordPage;
