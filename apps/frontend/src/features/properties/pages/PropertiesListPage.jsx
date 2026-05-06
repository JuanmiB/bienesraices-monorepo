import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@shared/components/layout";
import { Spinner, EmptyState, useToast } from "@shared/components/feedback";
import { getProperties } from "@features/properties/services";
import {
  SearchToolbar,
  SearchStats,
  ActiveFiltersBar,
  PropertyCardPremium,
  QuickViewModal,
  CompareBar,
  CompareModal,
  MapView
} from "../components/search";

const DEFAULT_PRICE_RANGE = { min: 0, max: 10_000_000 };

const DEFAULT_FILTERS = {
  priceMin: DEFAULT_PRICE_RANGE.min,
  priceMax: DEFAULT_PRICE_RANGE.max,
  areaMin: null,
  areaMax: null,
  bedrooms: null,
  bathrooms: null,
  propertyType: null,
};

const sortProperties = (list, sortBy) => {
  switch (sortBy) {
    case 'price-asc':
      return [...list].sort((a, b) => a.price - b.price);
    case 'price-desc':
      return [...list].sort((a, b) => b.price - a.price);
    case 'date-desc':
      return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'area-desc':
      return [...list].sort((a, b) => (b.totalArea || 0) - (a.totalArea || 0));
    default:
      return list;
  }
};

const PropertiesListPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const category = searchParams.get('propertyType');
  const toast = useToast();

  const { data: results = [], isLoading: loading, isError } = useQuery({
    queryKey: ['properties', { query, category }],
    queryFn: () => getProperties({ q: query, propertyType: category }),
  });
  const error = isError ? "Hubo un problema al obtener los resultados." : null;

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, propertyType: category || null });

  const [quickViewProperty, setQuickViewProperty] = useState(null);
  const [compareProperties, setCompareProperties] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, propertyType: category || null }));
  }, [category]);

  const filteredResults = useMemo(() => {
    let filtered = results;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(lower) ||
          p.address?.toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower)
      );
    }

    if (filters.priceMin !== DEFAULT_PRICE_RANGE.min || filters.priceMax !== DEFAULT_PRICE_RANGE.max) {
      filtered = filtered.filter(
        (p) =>
          p.price >= (filters.priceMin || 0) &&
          p.price <= (filters.priceMax || Infinity)
      );
    }

    if (filters.areaMin || filters.areaMax) {
      filtered = filtered.filter(
        (p) =>
          (p.totalArea || 0) >= (filters.areaMin || 0) &&
          (p.totalArea || 0) <= (filters.areaMax || Infinity)
      );
    }

    if (filters.bedrooms) {
      filtered = filtered.filter((p) => (p.bedrooms || 0) >= filters.bedrooms);
    }

    if (filters.bathrooms) {
      filtered = filtered.filter((p) => (p.bathrooms || 0) >= filters.bathrooms);
    }

    if (filters.propertyType) {
      filtered = filtered.filter((p) => p.propertyType === filters.propertyType);
    }

    return sortProperties(filtered, sortBy);
  }, [results, searchTerm, filters, sortBy]);

  const priceRange = useMemo(() => {
    if (filteredResults.length === 0) return null;
    let min = Infinity;
    let max = -Infinity;
    for (const p of filteredResults) {
      if (p.price < min) min = p.price;
      if (p.price > max) max = p.price;
    }
    return { min, max };
  }, [filteredResults]);

  const handleToggleFavorite = useCallback((propertyId) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  }, []);

  const handleToggleCompare = useCallback((property) => {
    setCompareProperties((prev) => {
      if (prev.find((p) => p.id === property.id)) {
        return prev.filter((p) => p.id !== property.id);
      }
      if (prev.length >= 3) {
        toast.info('Máximo 3 propiedades para comparar');
        return prev;
      }
      return [...prev, property];
    });
  }, [toast]);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm('');
  }, []);

  const handleRemoveFilter = useCallback((key) => {
    setFilters((prev) => {
      if (key === 'price') return { ...prev, priceMin: DEFAULT_PRICE_RANGE.min, priceMax: DEFAULT_PRICE_RANGE.max };
      if (key === 'area') return { ...prev, areaMin: null, areaMax: null };
      return { ...prev, [key]: null };
    });
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleQuickView = useCallback((property) => setQuickViewProperty(property), []);

  const activeFiltersCount =
    (filters.priceMin !== DEFAULT_PRICE_RANGE.min || filters.priceMax !== DEFAULT_PRICE_RANGE.max ? 1 : 0) +
    (filters.areaMin || filters.areaMax ? 1 : 0) +
    (filters.bedrooms ? 1 : 0) +
    (filters.bathrooms ? 1 : 0) +
    (filters.propertyType ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeFiltersCount={activeFiltersCount}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!loading && !error && filteredResults.length > 0 && (
          <SearchStats
            totalResults={results.length}
            filteredResults={filteredResults.length}
            priceRange={priceRange}
          />
        )}

        <ActiveFiltersBar
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearFilters}
        />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <EmptyState
            icon="⚠️"
            title="Error al cargar"
            description={<span className="text-red-500">{error}</span>}
          />
        ) : filteredResults.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No se encontraron propiedades"
            description="Intenta ajustar los filtros o la búsqueda"
            action={
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition"
              >
                Limpiar filtros
              </button>
            }
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((property) => (
              <PropertyCardPremium
                key={property.id}
                property={property}
                onQuickView={handleQuickView}
                onToggleFavorite={handleToggleFavorite}
                onToggleCompare={handleToggleCompare}
                isFavorite={favorites.includes(property.id)}
                isComparing={compareProperties.some((p) => p.id === property.id)}
              />
            ))}
          </div>
        ) : viewMode === 'map' ? (
          <MapView
            properties={filteredResults}
            onPropertyClick={handleQuickView}
          />
        ) : (
          <EmptyState
            icon="📋"
            title="Vista Lista"
            description="Vista de lista disponible próximamente"
          />
        )}
      </div>

      {quickViewProperty && (
        <QuickViewModal
          property={quickViewProperty}
          onClose={() => setQuickViewProperty(null)}
        />
      )}

      <CompareBar
        selectedProperties={compareProperties}
        onRemoveFromCompare={(id) =>
          setCompareProperties((prev) => prev.filter((p) => p.id !== id))
        }
        onClearCompare={() => setCompareProperties([])}
        onOpenCompareModal={() => setShowCompareModal(true)}
      />

      {showCompareModal && (
        <CompareModal
          properties={compareProperties}
          onClose={() => setShowCompareModal(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default PropertiesListPage;
