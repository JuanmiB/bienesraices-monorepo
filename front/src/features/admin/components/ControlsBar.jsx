import PropTypes from 'prop-types';

const ControlsBar = ({
  categorias,
  selectedCategoria,
  onFilterChange,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Filtro por tipo */}
      <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300 px-4 py-2">
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <select
          value={selectedCategoria}
          onChange={onFilterChange}
          className="border-none focus:ring-0 text-sm bg-transparent cursor-pointer outline-none"
        >
          <option value="">Todas las categorías</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ordenar */}
      <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300 px-4 py-2">
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
          />
        </svg>
        <select
          value={sortBy}
          onChange={onSortChange}
          className="border-none focus:ring-0 text-sm bg-transparent cursor-pointer outline-none"
        >
          <option value="date-desc">Más recientes</option>
          <option value="date-asc">Más antiguos</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="name-asc">Nombre A-Z</option>
        </select>
      </div>
    </div>
  )
}

ControlsBar.propTypes = {
  categorias: PropTypes.array.isRequired,
  selectedCategoria: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired
};

export default ControlsBar
