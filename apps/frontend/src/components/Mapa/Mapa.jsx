import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import DraggableMarker from './Marker';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import PropTypes from 'prop-types';
import './Mapa.css';
// Configura los iconos usando `mergeOptions`
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position && position.lat && position.lng) {
      map.setView(position, undefined, { animate: true, duration: 0.5 });
    }
  }, [position, map]); // Incluye position completo para evitar warnings

  return null;
};

RecenterMap.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  })
};

const MapComponent = React.memo(({ lat, lng, isEditable, onChange, zoom = 16, height = 'h-[400px] md:h-[500px]' }) => {
  // Validar coordenadas
  const isValidCoordinate = (coord) => typeof coord === 'number' && !isNaN(coord) && isFinite(coord);

  if (!isValidCoordinate(lat) || !isValidCoordinate(lng)) {
    return (
      <div className={`${height} flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-300`}>
        <p className="text-gray-500 text-center px-4">
          Coordenadas inválidas
        </p>
      </div>
    );
  }

  return (
    <MapContainer
      center={{ lat, lng }}
      zoom={zoom}
      className={`${height} rounded-lg overflow-hidden shadow-md`}
      scrollWheelZoom={!isEditable} // Desactivar zoom con scroll cuando es editable
      zoomControl={true}
      style={{ zIndex: 0 }} // Asegurar que no se superponga con el header
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <RecenterMap position={{lat, lng}}/>
      <DraggableMarker isEditable={isEditable} changePosition={onChange} propertiePosition={{ lat, lng }} />
    </MapContainer>
  );
});

MapComponent.displayName = 'MapComponent';

MapComponent.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  isEditable: PropTypes.bool,
  onChange: PropTypes.func,
  zoom: PropTypes.number,
  height: PropTypes.string,
};

export default MapComponent;