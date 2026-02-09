import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FilterPanel from './FilterPanel';

const SearchToolbar = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onClearFilters,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  activeFiltersCount
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearchTerm]);

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onSearchChange('');
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Fila 1: Search + Filter Toggle + View Toggle */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {/* Barra de búsqueda */}
          <div className="flex-1 min-w-[250px] relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              placeholder="Buscar por ubicación, tipo o características..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       transition outline-none"
            />
            {localSearchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400
                         hover:text-gray-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Botón filtros avanzados */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
              showFilters
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filtros
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-white text-primary-600 rounded-full text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Dropdown ordenar */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl bg-white
                     hover:border-primary-500 focus:ring-2 focus:ring-primary-500
                     transition cursor-pointer outline-none"
          >
            <option value="relevance">Más relevantes</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="date-desc">Más recientes</option>
            <option value="area-desc">Mayor área</option>
          </select>

          {/* Toggle vista */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm'
                  : 'hover:bg-gray-200'
              }`}
              title="Vista Grid"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm'
                  : 'hover:bg-gray-200'
              }`}
              title="Vista Lista"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'map'
                  ? 'bg-white shadow-sm'
                  : 'hover:bg-gray-200'
              }`}
              title="Vista Mapa"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Panel de filtros avanzados (colapsable) */}
        {showFilters && (
          <FilterPanel
            filters={filters}
            onFiltersChange={onFiltersChange}
            onClearFilters={onClearFilters}
          />
        )}
      </div>
    </div>
  );
};

SearchToolbar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list', 'map']).isRequired,
  onViewModeChange: PropTypes.func.isRequired,
  activeFiltersCount: PropTypes.number.isRequired
};

export default SearchToolbar;
