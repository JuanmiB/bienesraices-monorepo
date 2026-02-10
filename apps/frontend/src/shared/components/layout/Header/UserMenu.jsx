import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Avatar } from '@shared/components';

/**
 * Componente UserMenu - Dropdown escalable para opciones de usuario
 *
 * Props:
 * - user: object - Objeto con datos del usuario (nombre, foto)
 * - logout: function - Callback para cerrar sesión
 * - menuItems: array - Array de items del menú [{ label, href?, onClick?, icon? }, ...]
 * - position: string - Posición del dropdown ('right' | 'left') - default: 'right'
 */
const UserMenu = ({ user, logout, menuItems = [], position = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Cerrar menú cuando clickea fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menú al presionar ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen]);

  // Items por defecto si no se proporcionan
  const defaultItems = [
    { label: 'Mi cuenta', href: '/perfil', icon: '👤' },
    { label: 'Mis propiedades', href: '/admin/mis-propiedades', icon: '🏠' },
    { label: 'Cerrar sesión', onClick: logout, icon: '🚪', isDanger: true },
  ];

  const items = menuItems.length > 0 ? menuItems : defaultItems;

  return (
    <div className="user-menu-container relative">
      {/* Botón para abrir/cerrar */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="user-menu-toggle flex items-center gap-2 hover:opacity-80 transition"
        aria-label="Menú de usuario"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {/* Avatar */}
        <Avatar
          src={user?.foto || user?.avatarUrl}
          firstName={user?.firstName || user?.nombre || user?.name || ''}
          lastName={user?.lastName || user?.apellido || ''}
          size="md"
        />

        {/* Arrow icon */}
        <svg
          className={`w-4 h-4 text-white transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          ref={menuRef}
          className={`user-menu-dropdown absolute top-full mt-2 bg-white rounded-lg shadow-lg min-w-max z-50 overflow-hidden ${
            position === 'left' ? 'left-0' : 'right-0'
          }`}
          role="menu"
          aria-label="Opciones de usuario"
        >
          {/* Header con nombre del usuario */}
          <li className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-700 font-semibold">
              {user?.nombre || user?.name || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </li>

          {/* Items del menú */}
          {items.map((item, index) => (
            <li key={index} role="none">
              {item.href ? (
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition ${
                    item.isDanger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                  }`}
                  role="menuitem"
                >
                  {item.icon && <span className="text-base">{item.icon}</span>}
                  {item.label}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition ${
                    item.isDanger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                  }`}
                  role="menuitem"
                >
                  {item.icon && <span className="text-base">{item.icon}</span>}
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

UserMenu.propTypes = {
  user: PropTypes.shape({
    foto: PropTypes.string,
    avatarUrl: PropTypes.string,
    firstName: PropTypes.string,
    nombre: PropTypes.string,
    name: PropTypes.string,
    lastName: PropTypes.string,
    apellido: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  logout: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      onClick: PropTypes.func,
      icon: PropTypes.string,
      isDanger: PropTypes.bool
    })
  ),
  position: PropTypes.oneOf(['right', 'left'])
};

export default UserMenu;
