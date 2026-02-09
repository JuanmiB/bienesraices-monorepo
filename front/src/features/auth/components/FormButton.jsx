import PropTypes from 'prop-types';

const FormButton = ({ label, type = "submit", isLoading }) => {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={`w-full py-2.5 rounded-lg font-semibold text-white transition duration-200 ${
        isLoading
          ? "bg-primary-400 cursor-not-allowed"
          : "bg-primary-600 hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow"
      }`}
    >
      {isLoading ? "Cargando..." : label}
    </button>
  );
};

FormButton.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  isLoading: PropTypes.bool
};

export default FormButton;