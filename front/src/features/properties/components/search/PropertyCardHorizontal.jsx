import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Car, Calendar, Heart, TrendingUp } from 'lucide-react';

const PropertyCardHorizontal = ({ property, onToggleFavorite, isFavorite }) => {
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

    const mainImage = images[0] || 'https://via.placeholder.com/600x400?text=Sin+imagen';

    const pricePerSqm = property.totalArea
        ? (property.price / property.totalArea).toFixed(0)
        : null;

    const handleClick = () => {
        navigate(`/propiedades/${property.id}`);
    };

    return (
        <article
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300
                     overflow-hidden border border-gray-100 cursor-pointer group
                     property-card-horizontal"
            aria-label={`Propiedad: ${property.title}`}
        >
            <div className="flex flex-col md:flex-row h-full">
                {/* Left Column: Image (35%) */}
                <div className="relative md:w-[35%] h-48 md:h-auto" role="img" aria-label="Imagen principal de la propiedad">
                    <img
                        src={mainImage}
                        alt={`Foto de ${property.title} ubicado en ${property.address}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/600x400?text=Imagen+no+disponible';
                        }}
                    />

                    {/* Badges overlay */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2" aria-label="Etiquetas de la propiedad">
                        {property.featured && (
                            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg" role="status">
                                ⭐ Destacada
                            </span>
                        )}
                        <span className="px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full shadow-lg">
                            {typeLabels[property.propertyType] || property.propertyType}
                        </span>
                    </div>

                    {/* Image counter */}
                    {images.length > 1 && (
                        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded-full" aria-label={`${images.length} fotos disponibles`}>
                            {images.length} fotos
                        </div>
                    )}

                    {/* Favorite button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite?.();
                        }}
                        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                        aria-pressed={isFavorite}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm
                                 transition-all shadow-lg
                                 ${isFavorite
                                     ? 'bg-pink-500 text-white'
                                     : 'bg-white/90 text-gray-700 hover:bg-white'
                                 }`}
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
                    </button>
                </div>

                {/* Right Column: Details (65%) */}
                <div className="md:w-[65%] p-5 flex flex-col justify-between" onClick={handleClick}>
                    {/* Top section: Title, Price, Location */}
                    <div>
                        {/* Operation type badge */}
                        <div className="mb-2">
                            <span
                                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                                          ${property.operationType === 'rent'
                                              ? 'bg-blue-100 text-blue-700'
                                              : 'bg-green-100 text-green-700'
                                          }`}
                            >
                                {property.operationType === 'rent' ? 'En Alquiler' : 'En Venta'}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {property.title}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm line-clamp-1">{property.address}</span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-extrabold text-primary-600">
                                    {property.currency} {property.price.toLocaleString()}
                                </p>
                                {pricePerSqm && (
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        {property.currency} {Number(pricePerSqm).toLocaleString()}/m²
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom section: Amenities */}
                    <div>
                        {/* Amenities grid */}
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 py-3 border-t border-gray-100" role="list" aria-label="Características de la propiedad">
                            <div className="flex flex-col items-center" role="listitem">
                                <Bed className="w-5 h-5 text-gray-600 mb-1" aria-hidden="true" />
                                <span className="text-xs text-gray-500">Habitaciones</span>
                                <span className="text-sm font-bold text-gray-900" aria-label={`${property.bedrooms || 0} habitaciones`}>
                                    {property.bedrooms || 0}
                                </span>
                            </div>

                            <div className="flex flex-col items-center" role="listitem">
                                <Bath className="w-5 h-5 text-gray-600 mb-1" aria-hidden="true" />
                                <span className="text-xs text-gray-500">Baños</span>
                                <span className="text-sm font-bold text-gray-900" aria-label={`${property.bathrooms || 0} baños`}>
                                    {property.bathrooms || 0}
                                </span>
                            </div>

                            <div className="flex flex-col items-center" role="listitem">
                                <Square className="w-5 h-5 text-gray-600 mb-1" aria-hidden="true" />
                                <span className="text-xs text-gray-500">m²</span>
                                <span className="text-sm font-bold text-gray-900" aria-label={`${property.totalArea || 0} metros cuadrados`}>
                                    {property.totalArea || 0}
                                </span>
                            </div>

                            <div className="flex flex-col items-center" role="listitem">
                                <Car className="w-5 h-5 text-gray-600 mb-1" aria-hidden="true" />
                                <span className="text-xs text-gray-500">Garajes</span>
                                <span className="text-sm font-bold text-gray-900" aria-label={`${property.garages || 0} garajes`}>
                                    {property.garages || 0}
                                </span>
                            </div>

                            <div className="flex flex-col items-center" role="listitem">
                                <Calendar className="w-5 h-5 text-gray-600 mb-1" aria-hidden="true" />
                                <span className="text-xs text-gray-500">Año</span>
                                <span className="text-sm font-bold text-gray-900" aria-label={`Construido en ${property.yearBuilt || 'año no disponible'}`}>
                                    {property.yearBuilt || 'N/A'}
                                </span>
                            </div>

                            <div className="flex flex-col items-center" role="listitem">
                                <div className="w-5 h-5 flex items-center justify-center mb-1" aria-hidden="true">
                                    <span className="text-lg">🏗️</span>
                                </div>
                                <span className="text-xs text-gray-500">Estado</span>
                                <span className="text-xs font-bold text-gray-900 truncate w-full text-center" aria-label={`Estado: ${property.condition || 'no disponible'}`}>
                                    {property.condition || 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* Agent and CTA */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                            {/* Agent info */}
                            {property.owner && (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                        <img
                                            src={property.owner?.avatarUrl || 'https://via.placeholder.com/100'}
                                            alt={property.owner?.firstName || 'Agente'}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/100?text=👤';
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Agente</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {property.owner?.firstName || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* CTA Button */}
                            <button
                                onClick={handleClick}
                                aria-label={`Ver detalles completos de ${property.title}`}
                                className="px-5 py-2 bg-primary-600 hover:bg-primary-700
                                         text-white text-sm font-semibold rounded-lg
                                         transition-colors shadow-md hover:shadow-lg"
                            >
                                Ver detalles →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PropertyCardHorizontal;
