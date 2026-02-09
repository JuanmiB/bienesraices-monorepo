import { useState } from 'react';
import PropTypes from 'prop-types';

const ImageGalleryHover = ({ images = [] }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Fallback image if no images provided
  const imageList = images.length > 0 ? images : ['/placeholder-property.jpg'];
  const currentImage = imageList[currentImageIdx];

  return (
    <div className="relative h-56 overflow-hidden group">
      <img
        src={currentImage}
        alt="Propiedad"
        className="w-full h-full object-cover transition-opacity duration-300"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/600x400?text=Imagen+no+disponible';
        }}
      />

      {/* Dots (aparecen en hover) */}
      {imageList.length > 1 && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2
                    flex gap-1.5 opacity-0 group-hover:opacity-100
                    transition-opacity"
        >
          {imageList.slice(0, 4).map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIdx(idx);
              }}
              className={`h-2 rounded-full transition ${
                idx === currentImageIdx
                  ? 'bg-white w-6'
                  : 'bg-white/60 hover:bg-white/80 w-2'
              }`}
            />
          ))}
        </div>
      )}

      {/* Contador de imágenes */}
      <div
        className="absolute bottom-3 right-3 px-2 py-1 bg-black/60
                  text-white text-xs rounded-full backdrop-blur-sm"
      >
        {imageList.length} {imageList.length === 1 ? 'foto' : 'fotos'}
      </div>

      {/* Flechas de navegación (aparecen en hover si hay múltiples imágenes) */}
      {imageList.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIdx((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8
                     bg-black/50 hover:bg-black/70 text-white rounded-full
                     flex items-center justify-center opacity-0 group-hover:opacity-100
                     transition-opacity"
            aria-label="Imagen anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIdx((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8
                     bg-black/50 hover:bg-black/70 text-white rounded-full
                     flex items-center justify-center opacity-0 group-hover:opacity-100
                     transition-opacity"
            aria-label="Imagen siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

ImageGalleryHover.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};

export default ImageGalleryHover;
