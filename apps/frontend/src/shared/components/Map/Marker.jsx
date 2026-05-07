import { useState, useMemo, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Marker, Popup, Tooltip } from "react-leaflet";

const DraggableMarker = ({ propertiePosition, isEditable, changePosition }) => {
  const [position, setPosition] = useState(propertiePosition);
  const [isDragging, setIsDragging] = useState(false);
  const markerRef = useRef(null);

  // Actualiza la posición del marcador si `propertiePosition` cambia
  useEffect(() => {
    if (propertiePosition && propertiePosition.lat && propertiePosition.lng) {
      setPosition(propertiePosition);
    }
  }, [propertiePosition]); // Incluye propertiePosition completo

  // Manejadores de eventos para hacer que el marcador sea arrastrable
  const eventHandlers = useMemo(
    () => ({
      dragstart() {
        setIsDragging(true);
      },
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const newPosition = marker.getLatLng();
          setPosition(newPosition);
          setIsDragging(false);

          // Solo llama a changePosition si existe
          if (changePosition && typeof changePosition === 'function') {
            changePosition(newPosition.lat, newPosition.lng);
          }
        }
      },
    }),
    [changePosition]
  );

  return (
    <Marker
      draggable={isEditable}
      eventHandlers={isEditable ? eventHandlers : {}}
      position={position}
      ref={markerRef}
      opacity={isDragging ? 0.6 : 1} // Feedback visual al arrastrar
    >
      {isEditable && (
        <Tooltip permanent direction="top" offset={[0, -20]} opacity={0.9}>
          <div className="text-xs font-medium">
            {isDragging ? "Suelta para confirmar" : "Arrastra para mover"}
          </div>
        </Tooltip>
      )}

      <Popup minWidth={120} maxWidth={250}>
        <div className="text-sm">
          <strong className="block mb-1">
            {isEditable ? "📍 Ubicación editable" : "📍 Ubicación de la propiedad"}
          </strong>
          {isEditable ? (
            <p className="text-xs text-gray-600">Arrastra el marcador para ajustar la ubicación exacta</p>
          ) : (
            <p className="text-xs text-gray-600">
              {typeof position.lat === 'number' && typeof position.lng === 'number' ? (
                <>
                  Lat: {position.lat.toFixed(6)}<br/>
                  Lng: {position.lng.toFixed(6)}
                </>
              ) : (
                'Coordenadas no disponibles'
              )}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

DraggableMarker.propTypes = {
  propertiePosition: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }).isRequired,
  isEditable: PropTypes.bool.isRequired,
  changePosition: PropTypes.func.isRequired
};

export default DraggableMarker;