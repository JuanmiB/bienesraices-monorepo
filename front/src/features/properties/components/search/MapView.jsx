import { useState } from 'react';

const MiniPropertyCard = ({ property, onClick, isSelected }) => (
  <div
    onClick={onClick}
    className={`p-3 mb-3 rounded-lg cursor-pointer transition ${
      isSelected
        ? 'bg-primary-50 border-2 border-primary-600'
        : 'bg-white border border-gray-200 hover:border-primary-300'
    }`}
  >
    <div className="flex gap-3">
      <img
        src={property.mainImageUrl || 'https://via.placeholder.com/100'}
        alt={property.title}
        className="w-20 h-20 rounded-lg object-cover"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/100?text=Sin+imagen';
        }}
      />
      <div className="flex-1">
        <p className="font-bold text-sm text-gray-900 line-clamp-1">{property.title}</p>
        <p className="text-primary-600 font-bold text-lg">
          {property.currency} {property.price.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 line-clamp-1">{property.address}</p>
      </div>
    </div>
  </div>
);

const MapView = ({ properties, onPropertyClick }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    onPropertyClick(property);
  };

  return (
    <div className="flex h-[calc(100vh-300px)] gap-4 rounded-xl overflow-hidden relative z-0">
      {/* Panel lateral con lista mini (30%) */}
      <div className="w-80 overflow-y-auto bg-gray-50 rounded-xl shadow-md p-4">
        <h3 className="font-bold text-gray-900 mb-4">
          {properties.length} propiedades en el mapa
        </h3>
        {properties.map((property) => (
          <MiniPropertyCard
            key={property.id}
            property={property}
            onClick={() => handlePropertyClick(property)}
            isSelected={selectedProperty?.id === property.id}
          />
        ))}
      </div>

      {/* Mapa placeholder (70%) */}
      <div className="flex-1 rounded-xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <svg
            className="w-24 h-24 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Vista de Mapa</h3>
          <p className="text-gray-500 mb-4">
            La integración con mapas interactivos estará disponible próximamente
          </p>
          <p className="text-sm text-gray-400">
            Para habilitar esta función, instala react-leaflet:
            <br />
            <code className="bg-gray-200 px-2 py-1 rounded mt-2 inline-block">
              npm install react-leaflet leaflet
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapView;
