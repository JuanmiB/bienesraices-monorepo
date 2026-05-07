import { create } from 'zustand'

/**
 * Favorites Store
 * Manages user's favorite properties
 *
 * Note: Persistence is handled by platform-specific code
 * - Web: persist middleware with localStorage
 * - Mobile: persist middleware with AsyncStorage
 */

interface FavoritesState {
  // State
  favoriteIds: number[]

  // Actions
  addFavorite: (propertyId: number) => void
  removeFavorite: (propertyId: number) => void
  toggleFavorite: (propertyId: number) => void
  isFavorite: (propertyId: number) => boolean
  clearFavorites: () => void
  getFavoriteCount: () => number
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  // Initial state
  favoriteIds: [],

  // Add to favorites
  addFavorite: (propertyId: number) => {
    set((state) => {
      if (state.favoriteIds.includes(propertyId)) {
        return state // Already in favorites
      }
      return {
        favoriteIds: [...state.favoriteIds, propertyId]
      }
    })
  },

  // Remove from favorites
  removeFavorite: (propertyId: number) => {
    set((state) => ({
      favoriteIds: state.favoriteIds.filter((id) => id !== propertyId)
    }))
  },

  // Toggle favorite status
  toggleFavorite: (propertyId: number) => {
    const { favoriteIds } = get()
    if (favoriteIds.includes(propertyId)) {
      get().removeFavorite(propertyId)
    } else {
      get().addFavorite(propertyId)
    }
  },

  // Check if property is favorited
  isFavorite: (propertyId: number) => {
    return get().favoriteIds.includes(propertyId)
  },

  // Clear all favorites
  clearFavorites: () => {
    set({ favoriteIds: [] })
  },

  // Get total count of favorites
  getFavoriteCount: () => {
    return get().favoriteIds.length
  }
}))

export default useFavoritesStore
