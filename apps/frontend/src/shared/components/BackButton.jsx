import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Componente BackButton - Botón inteligente para volver
 *
 * Props:
 * - fallbackPath: Ruta a la que volver si no hay historial (default: '/')
 * - label: Texto del botón (default: 'Volver')
 * - className: Clases CSS adicionales
 * - variant: Estilo del botón ('primary' | 'secondary' | 'ghost')
 */
const BackButton = ({
  fallbackPath = '/',
  label = 'Volver',
  className = '',
  variant = 'ghost'
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Verificar si hay estado de navegación previo (significa que vino de dentro del sitio)
    if (location.key !== 'default' && window.history.length > 1) {
      navigate(-1);
    } else {
      // Si no hay historial interno, ir al fallback
      navigate(fallbackPath);
    }
  };

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300'
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${variantClasses[variant] || variantClasses.ghost}
                  ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

BackButton.propTypes = {
  fallbackPath: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
};

export default BackButton;
