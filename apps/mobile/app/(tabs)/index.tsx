import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native'
import { propertyService } from '@bienesraices/shared-api'
import { useFavoritesStore } from '@bienesraices/shared-logic'
import { PropertyCard } from '@/components/PropertyCard'
import { SearchBar } from '@/components/SearchBar'
import { SymbolView } from 'expo-symbols'

export default function ExploreScreen() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    habitaciones: undefined as number | undefined,
    estacionamiento: undefined as number | undefined,
    wc: undefined as number | undefined,
  })

  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore()

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const params: any = {}

      if (searchQuery) params.q = searchQuery
      if (filters.habitaciones) params.bedrooms = filters.habitaciones
      if (filters.estacionamiento) params.garages = filters.estacionamiento
      if (filters.wc) params.bathrooms = filters.wc

      const response = await propertyService.search(params)
      setProperties(response.data || [])
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadProperties()
  }

  const handleSearch = () => {
    loadProperties()
  }

  const handleFavoriteToggle = (propertyId: number) => {
    if (isFavorite(propertyId)) {
      removeFavorite(propertyId)
    } else {
      addFavorite(propertyId)
    }
  }

  const FilterButton = ({ value, label, filterKey }: any) => {
    const isActive = filters[filterKey as keyof typeof filters] === value

    return (
      <Pressable
        style={[styles.filterButton, isActive && styles.filterButtonActive]}
        onPress={() => {
          setFilters(prev => ({
            ...prev,
            [filterKey]: isActive ? undefined : value
          }))
        }}
      >
        <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
          {label}
        </Text>
      </Pressable>
    )
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined)

  useEffect(() => {
    if (!loading) {
      loadProperties()
    }
  }, [filters])

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBarWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmit={handleSearch}
          />
        </View>
        <Pressable
          style={[styles.filterToggle, hasActiveFilters && styles.filterToggleActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SymbolView
            name={{ ios: 'line.3.horizontal.decrease.circle', android: 'filter_list', web: 'filter_list' }}
            size={24}
            tintColor={hasActiveFilters ? '#fff' : '#059669'}
          />
        </Pressable>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filterTitle}>Habitaciones</Text>
          <View style={styles.filterRow}>
            <FilterButton value={1} label="1+" filterKey="habitaciones" />
            <FilterButton value={2} label="2+" filterKey="habitaciones" />
            <FilterButton value={3} label="3+" filterKey="habitaciones" />
            <FilterButton value={4} label="4+" filterKey="habitaciones" />
          </View>

          <Text style={styles.filterTitle}>Estacionamiento</Text>
          <View style={styles.filterRow}>
            <FilterButton value={1} label="1+" filterKey="estacionamiento" />
            <FilterButton value={2} label="2+" filterKey="estacionamiento" />
            <FilterButton value={3} label="3+" filterKey="estacionamiento" />
          </View>

          <Text style={styles.filterTitle}>Baños</Text>
          <View style={styles.filterRow}>
            <FilterButton value={1} label="1+" filterKey="wc" />
            <FilterButton value={2} label="2+" filterKey="wc" />
            <FilterButton value={3} label="3+" filterKey="wc" />
          </View>

          {hasActiveFilters && (
            <Pressable
              style={styles.clearFiltersButton}
              onPress={() => setFilters({
                habitaciones: undefined,
                estacionamiento: undefined,
                wc: undefined,
              })}
            >
              <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Properties List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Cargando propiedades...</Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorite={isFavorite(item.id)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#059669"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🏠</Text>
              <Text style={styles.emptyTitle}>No se encontraron propiedades</Text>
              <Text style={styles.emptyText}>
                Intenta ajustar tus filtros o búsqueda
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  searchBarWrapper: {
    flex: 1,
  },
  filterToggle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleActive: {
    backgroundColor: '#059669',
  },
  filtersPanel: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  filterButtonActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  clearFiltersButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
})
