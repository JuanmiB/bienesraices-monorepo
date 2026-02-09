import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Seccion Principal */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Logo y Descripcion */}
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            BienesRaices
                        </h2>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Tu socio de confianza en bienes raices.
                            Encuentra el hogar de tus sueños con nosotros.
                        </p>
                    </div>

                    {/* Tipos de Propiedades */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Propiedades
                        </h3>
                        <ul className="space-y-2">
                            <FooterLink to="/buscar?propertyType=house">Casas</FooterLink>
                            <FooterLink to="/buscar?propertyType=apartment">Departamentos</FooterLink>
                            <FooterLink to="/buscar?propertyType=commercial">Locales Comerciales</FooterLink>
                            <FooterLink to="/buscar?propertyType=office">Oficinas</FooterLink>
                            <FooterLink to="/buscar?propertyType=land">Terrenos</FooterLink>
                        </ul>
                    </div>

                    {/* Servicios */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Servicios
                        </h3>
                        <ul className="space-y-2">
                            <FooterLink to="/buscar">Comprar</FooterLink>
                            <FooterLink to="/buscar">Alquilar</FooterLink>
                            <FooterLink to="/admin/mis-propiedades/crear-propiedad">
                                Publicar propiedad
                            </FooterLink>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Contacto
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <LocationIcon className="w-5 h-5 mt-0.5 text-[var(--color-primary)]" />
                                <span>Av. Principal 123, Ciudad</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <PhoneIcon className="w-5 h-5 text-[var(--color-primary)]" />
                                <a href="tel:+123456789" className="hover:text-white transition">
                                    +1 234 567 890
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <EmailIcon className="w-5 h-5 text-[var(--color-primary)]" />
                                <a href="mailto:info@bienesraices.com" className="hover:text-white transition">
                                    info@bienesraices.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Linea Divisoria */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-6 py-6">
                    <p className="text-gray-500 text-sm text-center">
                        © {currentYear} BienesRaices. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

// Componentes auxiliares
const FooterLink = ({ to, children }) => (
    <li>
        <Link
            to={to}
            className="text-gray-400 hover:text-white transition-colors duration-200"
        >
            {children}
        </Link>
    </li>
);

const LocationIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const PhoneIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const EmailIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

export default Footer;