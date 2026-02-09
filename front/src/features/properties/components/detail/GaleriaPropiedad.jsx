import { useState, useEffect } from 'react';

const GaleriaPropiedad = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 rounded">
        Sin imagen disponible
      </div>
    );
  }

  const activeImage = images[activeIndex];

  const prev = () => setActiveIndex(i => Math.max(0, i - 1));
  const next = () => setActiveIndex(i => Math.min(images.length - 1, i + 1));

  // Navegación con teclado (flechas)
  useEffect(() => {
    // Solo agregar listener si el modal está abierto
    if (!modalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex(i => Math.max(0, i - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex(i => Math.min(images.length - 1, i + 1));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setModalOpen(false);
      }
    };

    // Agregar listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup al desmontar o cuando cambia modalOpen
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen, images.length]);

  return (
    <div className="w-full">
      {/* Hero */}
      <div
        className="w-full h-64 md:h-80 rounded-lg overflow-hidden cursor-pointer bg-gray-100"
        onClick={() => setModalOpen(true)}
      >
        <img
          src={activeImage.url}
          alt={activeImage.description || 'Imagen de la propiedad'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails — solo si hay más de 1 imagen */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition ${
                i === activeIndex ? 'border-primary-500' : 'border-transparent'
              }`}
            >
              <img
                src={img.thumbnailUrl || img.url}
                alt={img.description || `Foto ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal lightbox */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300 transition z-10"
          >
            &times;
          </button>

          {/* Prev arrow */}
          {activeIndex > 0 && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-3 text-white text-4xl leading-none hover:text-gray-300 transition z-10 select-none"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <img
            src={activeImage.url}
            alt={activeImage.description || 'Imagen'}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={e => e.stopPropagation()}
          />

          {/* Next arrow */}
          {activeIndex < images.length - 1 && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-3 text-white text-4xl leading-none hover:text-gray-300 transition z-10 select-none"
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GaleriaPropiedad;
