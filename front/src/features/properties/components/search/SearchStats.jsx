const SearchStats = ({ totalResults, filteredResults, priceRange }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <p>
        Mostrando <span className="font-bold text-gray-900">{filteredResults}</span> de{' '}
        <span className="font-bold">{totalResults}</span> propiedades
      </p>
      {priceRange && (
        <p>
          Rango:{' '}
          <span className="font-semibold">
            USD {priceRange.min.toLocaleString()} - USD {priceRange.max.toLocaleString()}
          </span>
        </p>
      )}
    </div>
  </div>
);

export default SearchStats;
