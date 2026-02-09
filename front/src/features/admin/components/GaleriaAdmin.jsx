import { useState, useRef } from 'react';
import { api } from '@shared/services/api';

const GaleriaAdmin = ({ propertyId, images: initialImages, onImagesChange }) => {
  const [images, setImages] = useState(initialImages || []);
  const fileInputRef = useRef(null);

  const updateState = (newImages) => {
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await api.put(`/api/v1/users/me/properties/${propertyId}/images/${imageId}/primary`);
      updateState(images.map(img =>
        img.id === imageId
          ? { ...img, isPrimary: true }
          : { ...img, isPrimary: false }
      ));
    } catch {
      alert('Error al cambiar la imagen principal.');
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return;
    try {
      await api.delete(`/api/v1/users/me/properties/${propertyId}/images/${imageId}`);
      updateState(images.filter(img => img.id !== imageId));
    } catch {
      alert('Error al eliminar la imagen.');
    }
  };

  const handleAddFiles = async (files) => {
    if (!files || files.length === 0) return;
    const allowed = 8 - images.length;
    const toUpload = Array.from(files).slice(0, allowed);
    if (toUpload.length === 0) return;

    const formData = new FormData();
    toUpload.forEach(file => formData.append('imagenes', file));

    try {
      const res = await api.post(
        `/api/v1/users/me/properties/${propertyId}/images`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      updateState(res.data.data);
    } catch {
      alert('Error al agregar imágenes.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-gray-700">Fotos de la propiedad</h3>
        <span className="text-sm text-gray-400">{images.length}/8 fotos</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map(img => (
          <div key={img.id} className="relative">
            <img
              src={img.thumbnailUrl || img.url}
              alt="Foto de la propiedad"
              className="rounded-lg object-cover h-28 w-full"
            />

            {/* Badge principal */}
            {img.isPrimary && (
              <span className="absolute top-1 left-1 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                Principal
              </span>
            )}

            {/* Botones */}
            <div className="absolute bottom-1 right-1 flex gap-1">
              {!img.isPrimary && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(img.id)}
                  title="Marcar como principal"
                  className="bg-white/90 hover:bg-yellow-100 text-gray-700 rounded p-1 transition"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-yellow-500">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                title="Eliminar imagen"
                className="bg-white/90 hover:bg-red-100 text-gray-700 rounded p-1 transition"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {/* Dropzone para agregar más */}
        {images.length < 8 && (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg h-28 flex items-center justify-center cursor-pointer hover:border-primary-400 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-gray-400 text-2xl">+</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleAddFiles(e.target.files)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GaleriaAdmin;
