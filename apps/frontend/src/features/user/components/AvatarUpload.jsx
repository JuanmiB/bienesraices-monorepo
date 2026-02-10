import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Camera, Upload, X } from 'lucide-react';

/**
 * Componente para subir y previsualizar foto de perfil
 */
const AvatarUpload = ({ currentAvatar, onImageSelect, onImageRemove }) => {
  const [preview, setPreview] = useState(currentAvatar);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onImageSelect(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview del avatar */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="Preview del avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-5xl">
              👤
            </div>
          )}
        </div>

        {/* Botón de remover (aparece en hover si hay imagen) */}
        {preview && (
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600
                     text-white rounded-full flex items-center justify-center
                     shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title="Eliminar foto"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Botón de cámara (overlay en hover) */}
        <button
          onClick={handleClick}
          className="absolute inset-0 bg-black/50 rounded-full flex items-center
                   justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="Cambiar foto"
          type="button"
        >
          <Camera className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Zona de drag & drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`w-full max-w-md p-6 border-2 border-dashed rounded-lg
                   cursor-pointer transition-all ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Upload className={`w-8 h-8 ${isDragging ? 'text-primary-600' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-primary-600">Haz click</span> o arrastra una imagen
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG o JPEG (máx. 5MB)
          </p>
        </div>
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

AvatarUpload.propTypes = {
  currentAvatar: PropTypes.string,
  onImageSelect: PropTypes.func.isRequired,
  onImageRemove: PropTypes.func,
};

export default AvatarUpload;
