import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

const Dropzone = ({ setImagenes }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const available = 8 - files.length;
    const toAdd = acceptedFiles.slice(0, available).map(file =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    const updated = [...files, ...toAdd];
    setFiles(updated);
    setImagenes(updated);
  }, [files, setImagenes]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 8 - files.length,
    maxSize: 5 * 1024 * 1024,
    disabled: files.length >= 8,
    onDrop,
    onDropRejected: () => {
      alert('Archivo no válido. Asegúrate de subir imágenes de hasta 5MB.');
    },
  });

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    URL.revokeObjectURL(files[index].preview);
    setFiles(updated);
    setImagenes(updated);
  };

  // Cleanup de preview URLs al desmontarse
  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Grid de previews */}
      {files.length > 0 && (
        <div className="w-full max-w-md grid grid-cols-3 gap-2">
          {files.map((file, i) => (
            <div key={file.preview} className="relative">
              <img
                src={file.preview}
                alt={`Preview ${i + 1}`}
                className="w-full h-24 object-cover rounded-lg shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition leading-none"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone — siempre visible si hay menos de 8 archivos */}
      {files.length < 8 && (
        <div
          {...getRootProps({
            className: `w-full max-w-md p-6 border-2 rounded-lg text-center cursor-pointer transition ${
              isDragActive
                ? 'border-green-500 bg-green-50'
                : isDragReject
                ? 'border-red-500'
                : 'border-dashed border-gray-300 hover:border-gray-400'
            }`
          })}
        >
          <input {...getInputProps()} />
          <p className="text-gray-500">
            {isDragActive
              ? 'Suelta las imágenes aquí...'
              : files.length === 0
              ? 'Arrastra y suelta imágenes aquí, o haz clic para seleccionarlas'
              : 'Agregá más imágenes (máximo 8)'}
          </p>
          <p className="text-xs text-gray-400 mt-1">{files.length}/8 imágenes</p>
          {isDragReject && (
            <p className="text-red-500 mt-2 text-sm">Archivo no válido</p>
          )}
        </div>
      )}
    </div>
  );
};

Dropzone.propTypes = {
  setImagenes: PropTypes.func.isRequired
};

export default Dropzone;
