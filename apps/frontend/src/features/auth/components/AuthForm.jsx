import PropTypes from 'prop-types';

const AuthForm = ({ title, children, onSubmit }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center mb-6">
          Bienes <span className="font-normal text-primary-600">Raices</span>
        </h1>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-8 py-10">
          <h2 className="text-xl font-semibold text-center mb-6">{title}</h2>
          <form className="space-y-5" onSubmit={onSubmit}>
            {children}
          </form>
        </div>
      </div>
    </div>
  );
};

AuthForm.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default AuthForm;