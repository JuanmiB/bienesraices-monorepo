// PropiedadDescripcion.js
import PropTypes from 'prop-types';

const PropiedadDescripcion = ({ descripcion }) => (
    <div className="p-6 border-2 rounded bg-slate-100 h-fit md:hover:border-blue-600">
      <h2 className="text-xl font-bold">Descripción de la propiedad</h2>
      <div className="mt-2">
        <p>{descripcion}</p>
      </div>
    </div>
  );

PropiedadDescripcion.propTypes = {
  descripcion: PropTypes.string.isRequired
};

  export default PropiedadDescripcion;