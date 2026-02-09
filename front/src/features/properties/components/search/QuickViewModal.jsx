import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuickViewModal = ({ property, onClose }) => {
  const navigate = useNavigate();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

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
    : ['https://via.placeholder.com/600x400?text=Sin+imagen'];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center
                justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh]
                   overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con close */}
        <div
          className="sticky top-0 bg-white border-b border-gray-200 p-4
                    flex justify-between items-center z-10"
        >
          <h3 className="text-xl font-bold text-gray-900">Vista Rápida</h3>
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
          {/* Grid: Galería (60%) + Info (40%) */}
          <div className="grid md:grid-cols-5 gap-6">
            {/* Galería */}
            <div className="md:col-span-3">
              <div className="relative">
                <img
                  src={images[currentImageIdx]}
                  alt="Propiedad"
                  className="w-full h-96 object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=Imagen+no+disponible';
                  }}
                />
                {images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIdx(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden
                                   border-2 transition ${
                                     idx === currentImageIdx
                                       ? 'border-primary-600'
                                       : 'border-gray-200 hover:border-gray-400'
                                   }`}
                      >
                        <img
                          src={img}
                          alt={`Vista ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="px-2 py-1 bg-primary-50 text-primary-700
                             text-xs font-semibold rounded"
                >
                  {typeLabels[property.propertyType] || property.propertyType}
                </span>
                <span
                  className="px-2 py-1 bg-green-50 text-green-700
                             text-xs font-semibold rounded"
                >
                  {property.operationType === 'rent' ? 'En Alquiler' : 'En Venta'}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {property.title}
              </h2>

              <p className="text-3xl font-extrabold text-primary-600 mb-1">
                {property.currency} {property.price.toLocaleString()}
              </p>

              {property.totalArea && (
                <p className="text-sm text-gray-500 mb-4">
                  {property.currency}{' '}
                  {(property.price / property.totalArea).toFixed(0).toLocaleString()}/m²
                </p>
              )}

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

              {/* Amenidades grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛏️</span>
                  <div>
                    <p className="text-xs text-gray-500">Habitaciones</p>
                    <p className="font-bold">{property.bedrooms || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚿</span>
                  <div>
                    <p className="text-xs text-gray-500">Baños</p>
                    <p className="font-bold">{property.bathrooms || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📐</span>
                  <div>
                    <p className="text-xs text-gray-500">Área Total</p>
                    <p className="font-bold">{property.totalArea || 0}m²</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚗</span>
                  <div>
                    <p className="text-xs text-gray-500">Garajes</p>
                    <p className="font-bold">{property.garages || 0}</p>
                  </div>
                </div>
              </div>

              {/* Descripción corta */}
              {property.description && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-600 line-clamp-4">{property.description}</p>
                </div>
              )}

              {/* Acciones */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/propiedades/${property.id}`)}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700
                           text-white font-semibold rounded-xl transition"
                >
                  Ver propiedad completa →
                </button>
                <button
                  className="w-full py-3 border-2 border-primary-600
                           text-primary-600 hover:bg-primary-50
                           font-semibold rounded-xl transition"
                >
                  Contactar al agente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
