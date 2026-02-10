import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';

const typeLabels = {
  house: 'Casa',
  apartment: 'Departamento',
  land: 'Terreno',
  commercial: 'Local Comercial',
  office: 'Oficina',
  warehouse: 'Depósito'
}

const PropertyCard = ({ property, onDelete, onTogglePublish }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.mainImageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge de estado - absolute top-right */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              property.active
                ? 'bg-green-500 text-white'
                : 'bg-yellow-400 text-gray-800'
            }`}
          >
            {property.active ? '✓ Publicado' : '📝 Borrador'}
          </span>
        </div>

        {/* Badge de tipo - absolute top-left */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded bg-black/50 text-white text-xs backdrop-blur-sm">
            {typeLabels[property.propertyType]}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Título y precio */}
        <Link
          to={`/propiedades/${property.id}`}
          className="text-lg font-semibold text-gray-800 hover:text-primary-600 transition line-clamp-1 mb-2 block"
        >
          {property.title}
        </Link>

        <p className="text-2xl font-bold text-primary-600 mb-2">
          {property.currency} {Number(property.price).toLocaleString()}
        </p>

        {/* Ubicación */}
        <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {property.address}
        </p>

        {/* Stats row (bedrooms, bathrooms, area) */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <span>🛏️</span>
              <span>{property.bedrooms} hab</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <span>🚿</span>
              <span>{property.bathrooms} baños</span>
            </div>
          )}
          {property.totalArea && (
            <div className="flex items-center gap-1">
              <span>📐</span>
              <span>{property.totalArea}m²</span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <button
            onClick={() => onTogglePublish(property.id, property.active)}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
              property.active
                ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {property.active ? '📥 Despublicar' : '🚀 Publicar'}
          </button>

          <Link
            to={`editar/${property.id}`}
            className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
            title="Editar"
          >
            ✏️
          </Link>

          <button
            onClick={() => onDelete(property.id)}
            className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}

PropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    mainImageUrl: PropTypes.string,
    title: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    currency: PropTypes.string.isRequired,
    address: PropTypes.string,
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
    totalArea: PropTypes.number,
    active: PropTypes.bool,
    propertyType: PropTypes.string
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onTogglePublish: PropTypes.func.isRequired
};

export default PropertyCard
