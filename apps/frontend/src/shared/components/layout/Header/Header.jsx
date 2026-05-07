import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '@features/auth/context';
import { usePropertyTypes } from '@features/properties/hooks';
import UserMenu from './UserMenu';
import { Menu, X } from 'lucide-react';
import './Header.css'

const Header = () => {
    const { isAuthenticated, user, logout, loading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data, isLoading: categoriesLoading } = usePropertyTypes();
    const categories = data?.propertyTypes ?? [];
    const navigate = useNavigate();
    const location = useLocation();

    // Get selected category from URL
    const searchParams = new URLSearchParams(location.search);
    const selectedCategory = searchParams.get('propertyType');

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleCategoryClick = (categoryId) => {
        navigate(`/buscar?propertyType=${categoryId}`);
        closeMobileMenu();
    };

    return (
        <header className="sticky top-0 z-50 bg-[var(--color-primary)] shadow-lg" role="banner">
            <div className="flex justify-between px-6 h-[65px] items-center">
                {/* Logo */}
                <h1 className="text-2xl text-white font-extrabold">
                    <Link to="/" aria-label="Ir a la página principal de BienesRaices">
                        BienesRaices
                    </Link>
                </h1>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-6 items-center" aria-label="Navegación principal">
                    {loading ? (
                        <p className="text-white">Cargando...</p>
                    ) : isAuthenticated ? (
                        <UserMenu
                            user={user}
                            logout={logout}
                            position="right"
                        />
                    ) : (
                        <div className="flex gap-4 items-center">
                            <Link
                                to="/auth/acceder"
                                className="btn-outline-white"
                            >
                                Ingresa
                            </Link>
                            <Link
                                to="/auth/crear-cuenta"
                                className="btn-solid-white"
                            >
                                Crear Cuenta
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Hamburger Button */}
                <button
                    className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Horizontal Categories Bar - Desktop */}
            <nav className="hidden md:block bg-white border-t border-gray-200" aria-label="Categorías de propiedades">
                <div className="container mx-auto px-6 py-2">
                    <div className="flex items-center justify-center gap-8 overflow-x-auto scrollbar-hide" role="tablist">
                        {categoriesLoading ? (
                            <div className="py-5 text-sm text-gray-500" role="status" aria-live="polite">
                                Cargando categorías...
                            </div>
                        ) : (
                            categories.map((category) => (
                                <button
                                    key={category.value}
                                    onClick={() => handleCategoryClick(category.value)}
                                    role="tab"
                                    aria-selected={selectedCategory === category.value}
                                    aria-label={`Filtrar por ${category.label}`}
                                    className={`relative py-5 text-sm font-medium transition-colors whitespace-nowrap
                                              ${selectedCategory === category.value
                                                  ? 'text-primary-600'
                                                  : 'text-gray-700 hover:text-primary-600'
                                              }`}
                                >
                                    {category.label}
                                    {/* Animated underline */}
                                    <span
                                        aria-hidden="true"
                                        className={`absolute bottom-0 left-0 h-0.5 bg-primary-600 transition-all duration-300
                                                  ${selectedCategory === category.value
                                                      ? 'w-full'
                                                      : 'w-0 group-hover:w-full'
                                                  }`}
                                        style={{
                                            width: selectedCategory === category.value ? '100%' : '0%'
                                        }}
                                    />
                                    <style>{`
                                        button:hover span {
                                            width: 100%;
                                        }
                                    `}</style>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden mobile-menu-dropdown" role="dialog" aria-label="Menú de navegación móvil">
                    <nav className="flex flex-col px-6 py-4 bg-[var(--color-primary)] border-t border-white/20" aria-label="Navegación móvil">
                        {/* Categories Section in Mobile */}
                        <div className="mb-4 pb-4 border-b border-white/10">
                            <p className="text-white/90 font-medium mb-3 text-sm uppercase tracking-wide">
                                Categorías
                            </p>
                            <div className="space-y-2" role="menu" aria-label="Categorías de propiedades">
                                {categoriesLoading ? (
                                    <p className="text-white/60 text-sm" role="status" aria-live="polite">
                                        Cargando...
                                    </p>
                                ) : (
                                    categories.map((category) => (
                                        <button
                                            key={category.value}
                                            onClick={() => handleCategoryClick(category.value)}
                                            role="menuitem"
                                            aria-label={`Filtrar por ${category.label}`}
                                            aria-current={selectedCategory === category.value ? 'true' : 'false'}
                                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                                                      ${selectedCategory === category.value
                                                          ? 'bg-white/20 text-white font-medium'
                                                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                                                      }`}
                                        >
                                            {category.label}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <p className="text-white py-2" role="status" aria-live="polite">Cargando...</p>
                        ) : isAuthenticated ? (
                            <>
                                <span className="text-white/80 text-sm mb-2 pb-2 border-b border-white/10" role="status">
                                    Hola, {user?.nombre || user?.name || 'Usuario'}
                                </span>
                                <Link
                                    to="/perfil"
                                    className="mobile-menu-link"
                                    onClick={closeMobileMenu}
                                    aria-label="Ir a mi perfil de usuario"
                                >
                                    👤 Mi cuenta
                                </Link>
                                <Link
                                    to="/admin/mis-propiedades"
                                    className="mobile-menu-link"
                                    onClick={closeMobileMenu}
                                    aria-label="Ver mis propiedades publicadas"
                                >
                                    🏠 Mis propiedades
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        closeMobileMenu();
                                    }}
                                    className="mobile-menu-link text-red-300 text-left"
                                    aria-label="Cerrar sesión y salir de la cuenta"
                                >
                                    🚪 Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/auth/acceder"
                                    className="mobile-menu-link"
                                    onClick={closeMobileMenu}
                                    aria-label="Iniciar sesión en tu cuenta"
                                >
                                    Ingresa
                                </Link>
                                <Link
                                    to="/auth/crear-cuenta"
                                    className="mobile-menu-link"
                                    onClick={closeMobileMenu}
                                    aria-label="Crear una cuenta nueva"
                                >
                                    Crear Cuenta
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default React.memo(Header);
