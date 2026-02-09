import PropTypes from 'prop-types';

const ActiveFiltersBar = ({ filters, onRemoveFilter, onClearAll }) => {
  const activeFilters = [];

  // Solo mostrar filtro de precio si difiere de los valores por defecto
  if ((filters.priceMin && filters.priceMin > 0) || (filters.priceMax && filters.priceMax < 10000000)) {
    activeFilters.push({
      key: 'price',
      label: `USD ${filters.priceMin?.toLocaleString() || 0} - ${filters.priceMax?.toLocaleString() || '10M'}`
    });
  }

  // Solo mostrar filtro de área si difiere de los valores por defecto
  if ((filters.areaMin && filters.areaMin > 0) || (filters.areaMax && filters.areaMax < 1000)) {
    activeFilters.push({
      key: 'area',
      label: `${filters.areaMin || 0}m² - ${filters.areaMax || 1000}m²`
    });
  }

  if (filters.bedrooms) {
    activeFilters.push({
      key: 'bedrooms',
      label: `${filters.bedrooms}+ habitaciones`
    });
  }

  if (filters.bathrooms) {
    activeFilters.push({
      key: 'bathrooms',
      label: `${filters.bathrooms}+ baños`
    });
  }

  if (filters.propertyType) {
    const typeLabels = {
      house: 'Casa',
      apartment: 'Apartamento',
      office: 'Oficina',
      land: 'Terreno',
      warehouse: 'Bodega'
    };
    activeFilters.push({
      key: 'propertyType',
      label: typeLabels[filters.propertyType] || filters.propertyType
    });
  }

  if (filters.operationType) {
    activeFilters.push({
      key: 'operationType',
      label: filters.operationType === 'rent' ? 'En Alquiler' : 'En Venta'
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <span className="text-sm text-gray-600 font-medium">Filtros activos:</span>
      {activeFilters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onRemoveFilter(filter.key)}
          className="group px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full
                     text-sm font-medium flex items-center gap-2
                     hover:bg-primary-100 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
          aria-label={`Remover filtro: ${filter.label}`}
        >
          <span>{filter.label}</span>
          <svg
            className="w-4 h-4 text-primary-400 group-hover:text-primary-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700
                   font-medium underline transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 rounded"
        aria-label="Limpiar todos los filtros"
      >
        Limpiar todo
      </button>
    </div>
  );
};

ActiveFiltersBar.propTypes = {
  filters: PropTypes.shape({
    priceMin: PropTypes.number,
    priceMax: PropTypes.number,
    areaMin: PropTypes.number,
    areaMax: PropTypes.number,
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
    propertyType: PropTypes.string,
    operationType: PropTypes.string,
  }).isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};

export default ActiveFiltersBar;
