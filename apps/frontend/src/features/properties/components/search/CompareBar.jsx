import PropTypes from 'prop-types';

const CompareBar = ({
  selectedProperties,
  onRemoveFromCompare,
  onClearCompare,
  onOpenCompareModal
}) => {
  if (selectedProperties.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2
                    border-primary-600 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center
                      justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <p className="font-semibold text-gray-900">
            {selectedProperties.length} {selectedProperties.length === 1 ? 'propiedad seleccionada' : 'propiedades seleccionadas'} para comparar
          </p>
          <div className="flex gap-2">
            {selectedProperties.map((p) => (
              <div key={p.id} className="relative">
                <img
                  src={p.mainImageUrl || 'https://via.placeholder.com/100'}
                  alt={p.title}
                  className="w-16 h-16 rounded-lg object-cover border-2
                             border-primary-600"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100?text=Sin+imagen';
                  }}
                />
                <button
                  onClick={() => onRemoveFromCompare(p.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500
                             text-white rounded-full flex items-center
                             justify-center text-xs hover:bg-red-600 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClearCompare}
            className="px-4 py-2 text-gray-600 hover:text-gray-900
                       font-medium transition"
          >
            Limpiar
          </button>
          <button
            onClick={onOpenCompareModal}
            disabled={selectedProperties.length < 2}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700
                       text-white font-semibold rounded-xl transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comparar ({selectedProperties.length})
          </button>
        </div>
      </div>
    </div>
  );
};

CompareBar.propTypes = {
  selectedProperties: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      mainImageUrl: PropTypes.string
    })
  ).isRequired,
  onRemoveFromCompare: PropTypes.func.isRequired,
  onClearCompare: PropTypes.func.isRequired,
  onOpenCompareModal: PropTypes.func.isRequired
};

export default CompareBar;
