import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { propertyService } from '@bienesraices/shared-api'
import { useFavoritesStore } from '@bienesraices/shared-logic'
import { SymbolView } from 'expo-symbols'

const { width } = Dimensions.get('window')

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore()

  useEffect(() => {
    loadProperty()
  }, [id])

  const loadProperty = async () => {
    try {
      setLoading(true)
      const propertyId = typeof id === 'string' ? parseInt(id) : id
      const data = await propertyService.getById(propertyId)
      setProperty(data)
    } catch (error) {
      console.error('Error loading property:', error)
      Alert.alert('Error', 'No se pudo cargar la propiedad')
      router.back()
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = () => {
    if (isFavorite(property.id)) {
      removeFavorite(property.id)
    } else {
      addFavorite(property)
    }
  }

  const handleContact = () => {
    Alert.alert('Contactar', 'Función de contacto próximamente')
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    )
  }

  if (!property) {
    return null
  }

  const images = property.images?.length > 0
    ? property.images
    : [{ url: property.mainImageUrl || 'https://via.placeholder.com/400x300' }]

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width)
              setActiveImageIndex(index)
            }}
            scrollEventThrottle={16}
          >
            {images.map((img: any, index: number) => (
              <Image
                key={index}
                source={{ uri: img.url }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Image Indicators */}
          {images.length > 1 && (
            <View style={styles.indicators}>
              {images.map((_: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === activeImageIndex && styles.indicatorActive
                  ]}
                />
              ))}
            </View>
          )}

          {/* Back Button */}
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={24}
              tintColor="#111827"
            />
          </Pressable>

          {/* Favorite Button */}
          <Pressable style={styles.favoriteButton} onPress={handleFavoriteToggle}>
            <Text style={styles.favoriteIcon}>
              {isFavorite(property.id) ? '❤️' : '🤍'}
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Category Badge */}
          {property.propertyType && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{property.propertyType}</Text>
            </View>
          )}

          {/* Title */}
          <Text style={styles.title}>{property.title}</Text>

          {/* Price */}
          <Text style={styles.price}>
            {property.currency === 'USD' ? '$' : '$'}{property.price}
          </Text>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.feature}>
              <SymbolView
                name={{ ios: 'bed.double.fill', android: 'bed', web: 'bed' }}
                size={20}
                tintColor="#059669"
              />
              <Text style={styles.featureText}>
                {property.bedrooms || 0} {property.bedrooms === 1 ? 'Habitación' : 'Habitaciones'}
              </Text>
            </View>
            <View style={styles.feature}>
              <SymbolView
                name={{ ios: 'car.fill', android: 'directions_car', web: 'directions_car' }}
                size={20}
                tintColor="#059669"
              />
              <Text style={styles.featureText}>
                {property.garages || 0} {property.garages === 1 ? 'Cochera' : 'Cocheras'}
              </Text>
            </View>
            <View style={styles.feature}>
              <SymbolView
                name={{ ios: 'shower.fill', android: 'bathroom', web: 'bathroom' }}
                size={20}
                tintColor="#059669"
              />
              <Text style={styles.featureText}>
                {property.bathrooms || 0} {property.bathrooms === 1 ? 'Baño' : 'Baños'}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          {/* Owner Info */}
          {property.owner && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Publicado por</Text>
              <View style={styles.ownerCard}>
                <View style={styles.ownerAvatar}>
                  <Text style={styles.ownerAvatarText}>
                    {property.owner.firstName?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerName}>
                    {property.owner.firstName} {property.owner.lastName}
                  </Text>
                  <Text style={styles.ownerEmail}>{property.owner.email}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Location (if available) */}
          {(property.latitude && property.longitude) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ubicación</Text>
              <View style={styles.locationCard}>
                <SymbolView
                  name={{ ios: 'location.fill', android: 'location_on', web: 'location_on' }}
                  size={24}
                  tintColor="#059669"
                />
                <Text style={styles.locationText}>
                  {property.address}, {property.city}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.contactButton} onPress={handleContact}>
          <SymbolView
            name={{ ios: 'message.fill', android: 'chat', web: 'chat' }}
            size={20}
            tintColor="#fff"
            style={styles.contactIcon}
          />
          <Text style={styles.contactButtonText}>Contactar</Text>
        </Pressable>
      </View>
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
  scrollView: {
    flex: 1,
  },
  galleryContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#f3f4f6',
  },
  image: {
    width,
    height: 300,
  },
  indicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    backgroundColor: '#fff',
    width: 20,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 48,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 22,
  },
  content: {
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  categoryText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 32,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 20,
  },
  features: {
    gap: 12,
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ownerAvatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  ownerEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  contactIcon: {
    marginRight: 4,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})
