import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const CompareRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);

CompareRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

const CompareModal = ({ properties, onClose }) => {
  const navigate = useNavigate();

  const typeLabels = {
    house: 'Casa',
    apartment: 'Apartamento',
    office: 'Oficina',
    land: 'Terreno',
    warehouse: 'Bodega'
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center
                justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh]
                   overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 bg-white border-b border-gray-200 p-4
                    flex justify-between items-center z-10"
        >
          <h3 className="text-2xl font-bold text-gray-900">Comparar Propiedades</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100
                       flex items-center justify-center transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Grid de columnas (1 por propiedad) */}
          <div className={`grid grid-cols-${properties.length} gap-6`}>
            {properties.map((property) => (
              <div key={property.id} className="space-y-4">
                {/* Imagen */}
                <img
                  src={property.mainImageUrl || 'https://via.placeholder.com/400x300'}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Sin+imagen';
                  }}
                />

                {/* Título y precio */}
                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                    {property.title}
                  </h4>
                  <p className="text-2xl font-extrabold text-primary-600">
                    {property.currency} {property.price.toLocaleString()}
                  </p>
                </div>

                {/* Tabla de características */}
                <div className="space-y-2 text-sm">
                  <CompareRow label="Ubicación" value={property.address} />
                  <CompareRow
                    label="Tipo"
                    value={typeLabels[property.propertyType] || property.propertyType}
                  />
                  <CompareRow
                    label="Operación"
                    value={property.operationType === 'rent' ? 'Alquiler' : 'Venta'}
                  />
                  <CompareRow label="Habitaciones" value={property.bedrooms || 0} />
                  <CompareRow label="Baños" value={property.bathrooms || 0} />
                  <CompareRow label="Área Total" value={`${property.totalArea || 0}m²`} />
                  <CompareRow label="Garajes" value={property.garages || 'N/A'} />
                  {property.totalArea && (
                    <CompareRow
                      label="Precio/m²"
                      value={`${property.currency} ${(property.price / property.totalArea)
                        .toFixed(0)
                        .toLocaleString()}`}
                    />
                  )}
                  {property.yearBuilt && (
                    <CompareRow label="Año construcción" value={property.yearBuilt} />
                  )}
                  {property.condition && (
                    <CompareRow label="Estado" value={property.condition} />
                  )}
                </div>

                {/* Botón ver */}
                <button
                  onClick={() => navigate(`/propiedades/${property.id}`)}
                  className="w-full py-2 bg-primary-600 hover:bg-primary-700
                           text-white font-semibold rounded-xl transition"
                >
                  Ver detalles →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

CompareModal.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      mainImageUrl: PropTypes.string,
      propertyType: PropTypes.string.isRequired,
      operationType: PropTypes.string.isRequired,
      bedrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      bathrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      totalArea: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      garages: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      yearBuilt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      condition: PropTypes.string
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired
};

export default CompareModal;
