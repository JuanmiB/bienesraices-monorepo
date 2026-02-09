import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * Componente para mostrar y reemplazar la imagen de una propiedad
 * 
 * Props:
 * - imagenActual: string | File | null - URL o File de la imagen actual
 * - onImagenChange: function - Callback cuando se sube una nueva imagen
 * - permitirCambio: boolean - Si se permite cambiar la imagen (default: true)
 */
const ImagenPropiedad = ({ imagenActual, onImagenChange, permitirCambio = true }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Actualizar preview cuando cambia la imagen actual
  useEffect(() => {
    if (imagenActual) {
      if (typeof imagenActual === 'string') {
        // URL de imagen existente
        setPreviewUrl(imagenActual);
      } else if (imagenActual instanceof File) {
        // File object (nueva imagen)
        const objectUrl = URL.createObjectURL(imagenActual);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [imagenActual]);

  // Configurar dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: !permitirCambio || !isEditMode,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onImagenChange(acceptedFiles[0]);
        setIsEditMode(false);
      }
    },
    onDropRejected: (rejectedFiles) => {
      const error = rejectedFiles[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        alert('La imagen es muy grande. Máximo 5MB.');
      } else if (error?.code === 'file-invalid-type') {
        alert('Formato no permitido. Usa PNG, JPG, GIF o WebP.');
      }
    },
  });

  const handleEliminarImagen = () => {
    onImagenChange(null);
    setIsEditMode(false);
  };

  // Mostrar imagen con opción de editar
  if (previewUrl && !isEditMode) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-md">
          <img
            src={previewUrl}
            alt="Imagen de la propiedad"
            className="w-full h-auto rounded-lg shadow-md object-cover"
          />
          {permitirCambio && (
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition"
                title="Cambiar imagen"
              >
                ✏️ Cambiar
              </button>
              <button
                type="button"
                onClick={handleEliminarImagen}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                title="Eliminar imagen"
              >
                ✕ Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mostrar dropzone para subir imagen
  return (
    <div
      {...getRootProps({
        className: `w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${!permitirCambio || !isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`
      })}
    >
      <input {...getInputProps()} disabled={!permitirCambio || !isEditMode} />
      <div className="space-y-2">
        <p className="text-2xl">📸</p>
        <p className="text-gray-700 font-medium">
          {isDragActive
            ? 'Suelta la imagen aquí...'
            : 'Arrastra una imagen aquí o haz clic para seleccionar'}
        </p>
        <p className="text-xs text-gray-500">PNG, JPG, GIF o WebP • Máximo 5MB</p>
      </div>
    </div>
  );
};

export default ImagenPropiedad;
