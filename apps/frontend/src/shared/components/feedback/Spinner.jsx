import PropTypes from 'prop-types';

const SIZES = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-4',
};

const Spinner = ({ size = 'md', label, fullScreen = false, className = '' }) => {
  const ring = (
    <div
      role="status"
      aria-label={label || 'Cargando'}
      className={`${SIZES[size]} border-primary-600 border-t-transparent rounded-full animate-spin ${className}`}
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4">{ring}</div>
          {label && <p className="text-gray-600 font-medium">{label}</p>}
        </div>
      </div>
    );
  }

  return ring;
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  label: PropTypes.string,
  fullScreen: PropTypes.bool,
  className: PropTypes.string,
};

export default Spinner;
