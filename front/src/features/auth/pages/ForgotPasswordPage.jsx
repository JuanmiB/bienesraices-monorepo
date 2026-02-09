import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@features/auth/context';
import { AuthForm } from "@features/auth/components";
import { FormInput } from "@features/auth/components";
import { FormButton } from "@features/auth/components";

const ForgotPasswordPage = () => {
  const { recoverPassword, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await recoverPassword(email);
      setIsSuccess(true);
    } catch {
    }
  };

  return (
    <AuthForm title="Recuperar Contraseña" onSubmit={handleSubmit}>
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
            Hemos enviado un enlace de recuperación de contraseña a tu correo.
            Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
          </p>
          <Link to="/auth/acceder" className="inline-block mt-5 text-primary-600 hover:underline font-medium text-sm">
            Volver a Iniciar Sesión
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <p className="text-red-500 text-sm mb-4">{error?.response?.data?.message}</p>
          )}

          <FormInput
            type="email"
            id="email"
            label="Correo Electrónico"
            placeholder="email@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormButton label="Enviar" isLoading={loading} />

          <p className="text-sm text-gray-500 text-center mt-4">
            Te enviaremos un enlace para restablecer tu contraseña.
          </p>

          <Link to="/auth/acceder" className="block text-center text-primary-600 hover:underline font-medium text-sm mt-2">
            Volver a Iniciar Sesión
          </Link>
        </>
      )}
    </AuthForm>
  );
};

export default ForgotPasswordPage;
