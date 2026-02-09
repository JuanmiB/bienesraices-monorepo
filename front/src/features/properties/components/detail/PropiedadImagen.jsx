
// PropiedadImagen.js
const PropiedadImagen = ({ fotoPath }) => (
  <div className="row-span-1 col-span-2 p-2 border-2 flex flex-col items-center justify-center md:hover:border-blue-600 mb-2 bg-slate-100 rounded">
    {fotoPath ? (
      <img
        className="w-full object-cover"
        src={fotoPath}
        alt="Imagen de la propiedad"
      />
    ) : (
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
        Sin imagen disponible
      </div>
    )}
  </div>
);

export default PropiedadImagen;