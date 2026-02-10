import PropTypes from 'prop-types';
import PriceRangeSlider from './PriceRangeSlider';
import AreaRangeSlider from './AreaRangeSlider';

const FilterPanel = ({ filters, onFiltersChange, onClearFilters }) => {

  
  return (
    <div className="pt-4 pb-2 border-t border-gray-200 animate-slideDown">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro 1: Rango de precio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Rango de Precio
          </label>
          <PriceRangeSlider
            min={0}
            max={10000000}
            value={[filters.priceMin || 0, filters.priceMax || 10000000]}
            onChange={(newRange) =>
              onFiltersChange({
                priceMin: newRange[0],
                priceMax: newRange[1]
              })
            }
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1 pt-6">
            <span className="">USD {(filters.priceMin || 0).toLocaleString()}</span>
            <span>USD {(filters.priceMax || 10000000).toLocaleString()}</span>
          </div>
        </div>

        {/* Filtro 2: Área (m²) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Área Total (m²)
          </label>
          <AreaRangeSlider
            min={0}
            max={1000}
            value={[filters.areaMin || 0, filters.areaMax || 1000]}
            onChange={(newRange) =>
              onFiltersChange({
                areaMin: newRange[0],
                areaMax: newRange[1]
              })
            }
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1 pt-6">
            <span>{filters.areaMin || 0}m²</span>
            <span>{filters.areaMax || 1000}m²</span>
          </div>
        </div>

        {/* Filtro 3: Habitaciones */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Habitaciones
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() =>
                  onFiltersChange({
                    bedrooms: filters.bedrooms === num ? null : num
                  })
                }
                className={`flex-1 py-2 rounded-lg font-medium transition ${
                  filters.bedrooms === num
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {num}+
              </button>
            ))}
          </div>
        </div>

        {/* Filtro 4: Baños */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Baños
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() =>
                  onFiltersChange({
                    bathrooms: filters.bathrooms === num ? null : num
                  })
                }
                className={`flex-1 py-2 rounded-lg font-medium transition ${
                  filters.bathrooms === num
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {num}+
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Botón limpiar filtros */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClearFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900
                   font-medium transition"
        >
          Limpiar todos los filtros
        </button>
      </div>
    </div>
  );
};

FilterPanel.propTypes = {
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
  onFiltersChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

export default FilterPanel;
