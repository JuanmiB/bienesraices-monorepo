import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@shared/services/api";
import { useAuth } from "@features/auth/context";
import { Footer } from "@shared/components/layout";
import { BackButton } from "@shared/components";
import { AvatarUpload } from "../components";

const ProfilePage = () => {
  const { isAuthenticated, loading: authLoading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // null | "success" | "error"
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth/acceder');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/v1/users/me");
        const data = response.data.data;
        setUser(data);
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
        });
        // Establecer avatar actual si existe
        if (data.avatarUrl || data.foto) {
          setAvatarPreview(data.avatarUrl || data.foto);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (status) setStatus(null);
  };

  const handleAvatarSelect = (file, preview) => {
    setAvatarFile(file);
    setAvatarPreview(preview);
    if (status) setStatus(null);
  };

  const handleAvatarRemove = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Primero actualizar datos de perfil
      const response = await api.put("/api/v1/users/me", form);
      setUser(response.data.data);

      // Si hay nueva foto, subirla
      if (avatarFile) {
        await handleAvatarUpload();
        // Refrescar el usuario en el contexto para actualizar el header
        await refreshUser();
      }

      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await api.post('/api/v1/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Actualizar el usuario con la nueva foto
      setUser(prev => ({
        ...prev,
        avatarUrl: response.data.data.avatarUrl,
        foto: response.data.data.avatarUrl,
      }));

      setAvatarFile(null);
    } catch (error) {
      console.error('Error subiendo avatar:', error);
      throw error;
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (authLoading || loading) return <p className="text-center my-12 text-gray-500">Cargando...</p>;

  if (!isAuthenticated) return null;

  return (
    <>
      <section className="max-w-lg mx-auto my-8 px-4">
        <div className="mb-4">
          <BackButton fallbackPath="/" label="Volver al inicio" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>

        {/* Foto de perfil */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Foto de perfil</h2>
          <AvatarUpload
            currentAvatar={avatarPreview}
            onImageSelect={handleAvatarSelect}
            onImageRemove={handleAvatarRemove}
          />
          {avatarFile && (
            <p className="text-xs text-gray-500 text-center mt-4">
              Haz click en "Guardar cambios" para actualizar tu foto
            </p>
          )}
        </div>

      {/* Información de solo lectura */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Información de cuenta</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="text-gray-800 font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estado</span>
            <span className={`font-medium ${user?.verified ? 'text-green-600' : 'text-yellow-600'}`}>
              {user?.verified ? "Verificado" : "Pendiente de verificación"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tipo de usuario</span>
            <span className="text-gray-800 font-medium capitalize">{user?.userType || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Fecha de registro</span>
            <span className="text-gray-800 font-medium">
              {user?.registrationDate
                ? new Date(user.registrationDate).toLocaleDateString('es-AR')
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Formulario editable */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Datos personales</h2>

        {status === "success" && (
          <p className="text-green-600 text-sm mb-4">Perfil actualizado correctamente.</p>
        )}
        {status === "error" && (
          <p className="text-red-500 text-sm mb-4">Error al actualizar el perfil. Intentá de nuevo.</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Nombre</span>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Apellido</span>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Teléfono</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+54 11 1234 5678"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <button
            type="submit"
            disabled={loading || uploadingAvatar}
            className="w-full bg-[var(--color-primary)] text-white font-semibold py-2 rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || uploadingAvatar ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
      </section>
      <Footer />
    </>
  );
};

export default ProfilePage;
