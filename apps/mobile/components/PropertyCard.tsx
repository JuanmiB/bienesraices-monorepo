import React from 'react'
import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'

interface PropertyCardProps {
  property: any
  onFavoriteToggle?: (propertyId: number) => void
  isFavorite?: boolean
}

export function PropertyCard({ property, onFavoriteToggle, isFavorite }: PropertyCardProps) {
  const imageUrl = property.images?.[0]?.url || property.mainImageUrl || 'https://via.placeholder.com/400x300'

  const handlePress = () => {
    router.push(`/property/${property.id}`)
  }

  const handleFavoritePress = (e: any) => {
    e.stopPropagation()
    onFavoriteToggle?.(property.id)
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {onFavoriteToggle && (
          <Pressable
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </Pressable>
        )}
        {property.propertyType && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{property.propertyType}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {property.title}
        </Text>

        <Text style={styles.price}>
          {property.currency === 'USD' ? '$' : '$'}{property.price}
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🛏️</Text>
            <Text style={styles.featureText}>{property.bedrooms || 0}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🚗</Text>
            <Text style={styles.featureText}>{property.garages || 0}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🚿</Text>
            <Text style={styles.featureText}>{property.bathrooms || 0}</Text>
          </View>
        </View>

        {property.owner && (
          <Text style={styles.owner} numberOfLines={1}>
            Por: {property.owner.firstName} {property.owner.lastName}
          </Text>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.7,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 12,
  },
  features: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureIcon: {
    fontSize: 16,
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  owner: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
})
