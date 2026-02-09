import { useState, useEffect } from 'react';
import { useAuth } from '@features/auth/context';
import { useNavigate, Link } from 'react-router-dom';
import { AuthForm } from "@features/auth/components";
import { FormInput } from "@features/auth/components";
import { FormButton } from "@features/auth/components";

const LoginPage = () => {
  const { login, isAuthenticated, error, setError, loading } = useAuth(); // Asume que tienes `setError` en el contexto.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  // Redirigir si el usuario está autenticado.
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Limpiar el error cuando los inputs cambien.
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError(null); // Limpia el error.
  };

  return (
    <AuthForm title="Ingresa a tu cuenta" onSubmit={handleSubmit}>
      {/* Mensaje de error */}
      <div className="h-6">
        <p className={`text-red-500 text-sm ${error?.response?.data?.message ? 'block' : 'hidden'}`}>
          {error?.response?.data?.message}
        </p>
      </div>

      <FormInput
        type="email"
        id="email"
        label="Email"
        placeholder="email@ejemplo.com"
        value={email}
        onChange={handleInputChange(setEmail)}
      />
      <FormInput
        type="password"
        id="password"
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChange={handleInputChange(setPassword)}
      />
      <FormButton label="Iniciar Sesión" isLoading={loading} />
      <p className="text-sm text-gray-500 text-center">
        ¿Olvidaste tu contraseña?{' '}
        <Link to="/auth/recuperar-contraseña" className="text-primary-600 hover:underline" onClick={() => setError(null)}>
          Recupérala aquí
        </Link>
      </p>
      <p className="text-sm text-gray-500 text-center">
        ¿No tenés cuenta?{' '}
        <Link to="/auth/crear-cuenta" className="text-primary-600 hover:underline">
          Registráte aquí
        </Link>
      </p>
    </AuthForm>
  );
};

export default LoginPage;