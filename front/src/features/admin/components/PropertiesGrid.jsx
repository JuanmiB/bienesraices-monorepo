import PropTypes from 'prop-types';
import PropertyCard from './PropertyCard'

const PropertiesGrid = ({ properties = [], onDelete, onTogglePublish }) => {
  return (
    <>
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => (
            <PropertyCard
              key={p.id}
              property={p}
              onDelete={onDelete}
              onTogglePublish={onTogglePublish}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            No hay propiedades que coincidan con los filtros
          </p>
        </div>
      )}
    </>
  )
}

PropertiesGrid.propTypes = {
  properties: PropTypes.array,
  onDelete: PropTypes.func.isRequired,
  onTogglePublish: PropTypes.func.isRequired
};

export default PropertiesGrid
