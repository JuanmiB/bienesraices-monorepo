import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "@shared/services/api";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        return;
      }
      try {
        await api.post("/api/v1/auth/email/verify", { token });
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Verificando tu cuenta...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-green-600 mb-4">¡Cuenta verificada!</h2>
          <p className="text-gray-600 mb-6">Tu cuenta ha sido activada correctamente.</p>
          <button
            onClick={() => navigate("/auth/acceder")}
            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error de verificación</h2>
        <p className="text-gray-600 mb-6">El enlace es inválido o ya expiró.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
