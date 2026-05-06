import { useEffect, useState } from "react";
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

  // Estado de UI
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 10000000,
    areaMin: null,
    areaMax: null,
    bedrooms: null,
    bathrooms: null,
    propertyType: category || null
  });

  // Estados para modales e interacciones
  const [quickViewProperty, setQuickViewProperty] = useState(null);
  const [compareProperties, setCompareProperties] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Sincronizar filters con parámetros URL
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      propertyType: category || null
    }));
  }, [category]);

  // Aplicar filtros y ordenamiento
  const applyFiltersAndSort = (properties) => {
    let filtered = [...properties];

    // Filtro de búsqueda textual
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(lowerSearch) ||
          p.address?.toLowerCase().includes(lowerSearch) ||
          p.description?.toLowerCase().includes(lowerSearch)
      );
    }

    // Filtro de precio
    if (filters.priceMin !== 0 || filters.priceMax !== 10000000) {
      filtered = filtered.filter(
        (p) =>
          p.price >= (filters.priceMin || 0) &&
          p.price <= (filters.priceMax || Infinity)
      );
    }

    // Filtro de área
    if (filters.areaMin || filters.areaMax) {
      filtered = filtered.filter(
        (p) =>
          (p.totalArea || 0) >= (filters.areaMin || 0) &&
          (p.totalArea || 0) <= (filters.areaMax || Infinity)
      );
    }

    // Filtro de habitaciones
    if (filters.bedrooms) {
      filtered = filtered.filter((p) => (p.bedrooms || 0) >= filters.bedrooms);
    }

    // Filtro de baños
    if (filters.bathrooms) {
      filtered = filtered.filter((p) => (p.bathrooms || 0) >= filters.bathrooms);
    }

    // Filtro de tipo
    if (filters.propertyType) {
      filtered = filtered.filter((p) => p.propertyType === filters.propertyType);
    }

    // Ordenamiento
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'area-desc':
        filtered.sort((a, b) => (b.totalArea || 0) - (a.totalArea || 0));
        break;
      default:
        // relevance - mantener orden original
        break;
    }

    return filtered;
  };

  const filteredResults = applyFiltersAndSort(results);

  // Handlers
  const handleToggleFavorite = (propertyId) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleToggleCompare = (property) => {
    setCompareProperties((prev) => {
      const exists = prev.find((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      }
      if (prev.length >= 3) {
        toast.info('Máximo 3 propiedades para comparar');
        return prev;
      }
      return [...prev, property];
    });
  };

  const handleClearFilters = () => {
    setFilters({
      priceMin: 0,
      priceMax: 10000000,
      areaMin: null,
      areaMax: null,
      bedrooms: null,
      bathrooms: null,
      propertyType: null
    });
    setSearchTerm('');
  };

  const handleRemoveFilter = (key) => {
    if (key === 'price') {
      setFilters({ ...filters, priceMin: 0, priceMax: 10000000 });
    } else if (key === 'area') {
      setFilters({ ...filters, areaMin: null, areaMax: null });
    } else {
      setFilters({ ...filters, [key]: null });
    }
  };

  const activeFiltersCount =
    (filters.priceMin !== 0 || filters.priceMax !== 10000000 ? 1 : 0) +
    (filters.areaMin || filters.areaMax ? 1 : 0) +
    (filters.bedrooms ? 1 : 0) +
    (filters.bathrooms ? 1 : 0) +
    (filters.propertyType ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toolbar sticky */}
      <SearchToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
        onClearFilters={handleClearFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeFiltersCount={activeFiltersCount}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        {!loading && !error && filteredResults.length > 0 && (
          <SearchStats
            totalResults={results.length}
            filteredResults={filteredResults.length}
            priceRange={
              filteredResults.length > 0
                ? {
                    min: Math.min(...filteredResults.map((p) => p.price)),
                    max: Math.max(...filteredResults.map((p) => p.price))
                  }
                : null
            }
          />
        )}

        {/* Active filters pills */}
        <ActiveFiltersBar
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearFilters}
        />

        {/* Vista condicional */}
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
                onQuickView={() => setQuickViewProperty(property)}
                onToggleFavorite={() => handleToggleFavorite(property.id)}
                onToggleCompare={() => handleToggleCompare(property)}
                isFavorite={favorites.includes(property.id)}
                isComparing={compareProperties.some((p) => p.id === property.id)}
              />
            ))}
          </div>
        ) : viewMode === 'map' ? (
          <MapView
            properties={filteredResults}
            onPropertyClick={(property) => setQuickViewProperty(property)}
          />
        ) : (
          <EmptyState
            icon="📋"
            title="Vista Lista"
            description="Vista de lista disponible próximamente"
          />
        )}
      </div>

      {/* Modals y overlays */}
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
