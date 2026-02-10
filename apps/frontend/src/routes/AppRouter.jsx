import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Header } from "@shared/components/layout";
import PrivateRoute from "./PrivateRoute";

// Lazy loading de páginas para code splitting
// Auth pages (new structure)
const LoginPage = lazy(() => import("@features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@features/auth/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@features/auth/pages/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("@features/auth/pages/VerifyEmailPage"));

// Properties pages (new structure)
const PropertiesListPage = lazy(() => import("@features/properties/pages/PropertiesListPage"));
const PropertyDetailPage = lazy(() => import("@features/properties/pages/PropertyDetailPage"));

// Admin pages (new structure)
const MyPropertiesPage = lazy(() => import("@features/admin/pages/MyPropertiesPage"));
const CreatePropertyPage = lazy(() => import("@features/admin/pages/CreatePropertyPage"));
const EditPropertyPage = lazy(() => import("@features/admin/pages/EditPropertyPage"));

// User pages (new structure)
const ProfilePage = lazy(() => import("@features/user/pages/ProfilePage"));

// Home page (new structure)
const HomePage = lazy(() => import("@features/home/pages/HomePage"));

// Componente de carga mientras se cargan las páginas
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Cargando...</p>
    </div>
  </div>
);

const AppRouter = () => {
    return (
      <>
        <Header/>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/buscar" element={<PropertiesListPage />} />
            <Route path="/propiedades/:id" element={<PropertyDetailPage />} />
            <Route path="/auth/acceder" element={<LoginPage />} />
            <Route path="/auth/crear-cuenta" element={<RegisterPage />} />
            <Route path="/auth/recuperar-contraseña" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/auth/verify" element={<VerifyEmailPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/admin/mis-propiedades" element={<MyPropertiesPage />} />
              <Route path="/admin/mis-propiedades/crear-propiedad" element={<CreatePropertyPage isEditable/>} />
              <Route path="/admin/mis-propiedades/editar/:id" element={<EditPropertyPage />} />
            </Route>
          </Routes>
        </Suspense>
      </>
    );
  };
  
  export default AppRouter;