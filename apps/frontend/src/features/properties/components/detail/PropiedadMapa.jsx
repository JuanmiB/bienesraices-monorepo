import PropTypes from 'prop-types';
import MapComponent from "../../../../components/Mapa/Mapa";
import { MapPin } from 'lucide-react';

const PropiedadMapa = ({ lat, lng }) => {
  // Convertir coordenadas a números si vienen como strings
  const latitude = lat !== undefined && lat !== null ? Number(lat) : null;
  const longitude = lng !== undefined && lng !== null ? Number(lng) : null;

  // Validar que sean números válidos
  const hasValidCoordinates =
    latitude !== null &&
    longitude !== null &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    isFinite(latitude) &&
    isFinite(longitude);

  return (
    <div className="w-full">
      {/* Header del mapa */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-800">Ubicación</h3>
      </div>

      {/* Contenedor del mapa */}
      <div className="rounded-xl overflow-hidden border-2 border-gray-200 hover:border-primary-500 transition-colors duration-300 relative z-0">
        {hasValidCoordinates ? (
          <MapComponent
            lat={latitude}
            lng={longitude}
            isEditable={false}
            zoom={15}
            height="h-[300px] sm:h-[400px] lg:h-[450px]"
          />
        ) : (
          <div className="h-[300px] flex flex-col items-center justify-center bg-gray-50">
            <MapPin className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Ubicación no disponible</p>
            <p className="text-gray-400 text-sm">No se proporcionaron coordenadas para esta propiedad</p>
          </div>
        )}
      </div>
    </div>
  );
};

PropiedadMapa.propTypes = {
  lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PropiedadMapa;