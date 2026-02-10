import PropTypes from 'prop-types';

/**
 * Componente Avatar - Muestra foto de usuario o iniciales
 *
 * @param {string} src - URL de la imagen del avatar
 * @param {string} firstName - Nombre del usuario
 * @param {string} lastName - Apellido del usuario
 * @param {string} size - Tamaño del avatar ('sm', 'md', 'lg', 'xl')
 * @param {string} className - Clases CSS adicionales
 */
const Avatar = ({ src, firstName = '', lastName = '', size = 'md', className = '' }) => {
  // Generar iniciales
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
    return firstInitial + lastInitial || '?';
  };

  // Tamaños predefinidos
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const sizeClasses = sizes[size] || sizes.md;

  // Colores de fondo basados en la primera letra del nombre
  const getBackgroundColor = () => {
    const colors = [
      'bg-primary-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];

    const firstChar = firstName?.charAt(0)?.toLowerCase() || 'a';
    const index = firstChar.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (src) {
    return (
      <img
        src={src}
        alt={`Avatar de ${firstName} ${lastName}`.trim()}
        className={`${sizeClasses} rounded-full object-cover border-2 border-white shadow-sm ${className}`}
        onError={(e) => {
          // Si la imagen falla al cargar, ocultar el elemento y mostrar las iniciales
          e.target.style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full ${getBackgroundColor()}
                  flex items-center justify-center text-white font-semibold
                  border-2 border-white shadow-sm ${className}`}
      title={`${firstName} ${lastName}`.trim()}
    >
      {getInitials()}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string
};

export default Avatar;
