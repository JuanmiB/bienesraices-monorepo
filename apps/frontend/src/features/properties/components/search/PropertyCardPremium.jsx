import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ImageGalleryHover from './ImageGalleryHover';
import { Avatar } from '@shared/components';

const PropertyCardPremium = ({
  property,
  onQuickView,
  onToggleFavorite,
  onToggleCompare,
  isFavorite,
  isComparing
}) => {
  const navigate = useNavigate();

  const typeLabels = {
    house: 'Casa',
    apartment: 'Apartamento',
    office: 'Oficina',
    land: 'Terreno',
    warehouse: 'Bodega'
  };

  const images = property.images?.length > 0
    ? property.images.map(img => img.url || img)
    : property.mainImageUrl
    ? [property.mainImageUrl]
    : [];

  const pricePerSqm = property.totalArea
    ? (property.price / property.totalArea).toFixed(0)
    : null;

  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300
                overflow-hidden group border border-gray-100 relative property-card animate-fadeIn"
    >
      {/* Badge destacada */}
      {property.featured && (
        <div className="absolute top-4 right-4 z-10">
          <span
            className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full
                       shadow-lg flex items-center gap-1"
          >
            ⭐ Destacada
          </span>
        </div>
      )}

      {/* Galería con hover */}
      <div className="relative">
        <ImageGalleryHover images={images} />

        {/* Botones overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`w-10 h-10 backdrop-blur-sm rounded-full
                       flex items-center justify-center hover:bg-white
                       transition shadow-md ${
                         isFavorite ? 'bg-pink-500 text-white' : 'bg-white/90 text-gray-700'
                       }`}
            title="Agregar a favoritos"
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            className={`w-10 h-10 backdrop-blur-sm rounded-full
                       flex items-center justify-center hover:bg-white
                       transition shadow-md ${
                         isComparing ? 'bg-primary-600 text-white' : 'bg-white/90 text-gray-700'
                       }`}
            title="Comparar"
          >
            {isComparing ? '✓' : '📊'}
          </button>
        </div>

        {/* Quick view button (aparece en hover) */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0
                    group-hover:opacity-100 transition-opacity"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView();
            }}
            className="px-4 py-2 bg-white text-primary-600 font-semibold
                       rounded-lg shadow-lg hover:bg-gray-50 transition"
          >
            👁️ Vista Rápida
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Badges de tipo */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="px-2 py-1 bg-primary-50 text-primary-700 text-xs
                       font-semibold rounded"
          >
            {typeLabels[property.propertyType] || property.propertyType}
          </span>
          <span
            className="px-2 py-1 bg-green-50 text-green-700 text-xs
                       font-semibold rounded"
          >
            {property.operationType === 'rent' ? 'En Alquiler' : 'En Venta'}
          </span>
        </div>

        {/* Precio con precio/m² */}
        <div className="mb-2">
          <p className="text-3xl font-extrabold text-primary-600">
            {property.currency} {property.price.toLocaleString()}
          </p>
          {pricePerSqm && (
            <p className="text-sm text-gray-500">
              {property.currency} {Number(pricePerSqm).toLocaleString()}/m²
            </p>
          )}
        </div>

        {/* Título */}
        <h3
          className="font-bold text-gray-900 text-lg mb-1 line-clamp-2
                   hover:text-primary-600 cursor-pointer transition"
          onClick={() => navigate(`/propiedades/${property.id}`)}
        >
          {property.title}
        </h3>

        {/* Ubicación */}
        <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Grid de amenidades (3x2) */}
        <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-100 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">🛏️</span>
            <span className="text-xs text-gray-500">Hab.</span>
            <span className="font-bold text-gray-900">{property.bedrooms || 0}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">🚿</span>
            <span className="text-xs text-gray-500">Baños</span>
            <span className="font-bold text-gray-900">{property.bathrooms || 0}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">📐</span>
            <span className="text-xs text-gray-500">m²</span>
            <span className="font-bold text-gray-900">{property.totalArea || 0}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">🚗</span>
            <span className="text-xs text-gray-500">Garajes</span>
            <span className="font-bold text-gray-900">{property.garages || 0}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">📅</span>
            <span className="text-xs text-gray-500">Año</span>
            <span className="font-bold text-gray-900">{property.yearBuilt || 'N/A'}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">🏗️</span>
            <span className="text-xs text-gray-500">Estado</span>
            <span className="font-bold text-gray-900 text-xs">
              {property.condition || 'N/A'}
            </span>
          </div>
        </div>

        {/* Footer con owner y acciones */}
        <div className="flex items-center justify-between">
          {/* Mini owner card */}
          <div className="flex items-center gap-2">
            <Avatar
              src={property.owner?.avatarUrl}
              firstName={property.owner?.firstName || ''}
              lastName={property.owner?.lastName || ''}
              size="sm"
            />
            <div>
              <p className="text-xs text-gray-500">Agente</p>
              <p className="text-sm font-semibold text-gray-900">
                {property.owner?.firstName || 'N/A'}
              </p>
            </div>
          </div>

          {/* Botón ver detalles */}
          <button
            onClick={() => navigate(`/propiedades/${property.id}`)}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700
                       text-white font-semibold rounded-lg transition
                       shadow-md hover:shadow-lg"
          >
            Ver detalles →
          </button>
        </div>
      </div>
    </div>
  );
};

PropertyCardPremium.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    propertyType: PropTypes.string.isRequired,
    operationType: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
    totalArea: PropTypes.number,
    garages: PropTypes.number,
    yearBuilt: PropTypes.number,
    condition: PropTypes.string,
    featured: PropTypes.bool,
    mainImageUrl: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          url: PropTypes.string
        })
      ])
    ),
    owner: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      avatarUrl: PropTypes.string
    })
  }).isRequired,
  onQuickView: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onToggleCompare: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  isComparing: PropTypes.bool.isRequired,
};

export default PropertyCardPremium;
