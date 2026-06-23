import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { useFavoritesStore } from '@bienesraices/shared-logic'
import { propertyService } from '@bienesraices/shared-api'
import { PropertyCard } from '@/components/PropertyCard'

export default function FavoritesScreen() {
  const { favoriteIds, removeFavorite, isFavorite } = useFavoritesStore()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavoriteProperties()
  }, [favoriteIds])

  const loadFavoriteProperties = async () => {
    if (favoriteIds.length === 0) {
      setProperties([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      // Load all favorite properties
      const promises = favoriteIds.map(id => propertyService.getById(id))
      const loadedProperties = await Promise.all(promises)
      setProperties(loadedProperties.filter(Boolean))
    } catch (error) {
      console.error('Error loading favorite properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = (propertyId: number) => {
    removeFavorite(propertyId)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {properties.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
          <Text style={styles.emptyText}>
            Las propiedades que marques como favoritas aparecerán aquí
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mis Favoritos</Text>
            <Text style={styles.headerCount}>{properties.length} propiedades</Text>
          </View>

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
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  headerCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
})
