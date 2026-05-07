import { useState } from 'react'

/**
 * Platform-agnostic form state management hook
 *
 * Note: This hook doesn't handle DOM events directly.
 * Platform-specific wrappers should handle onChange events:
 * - Web: e.target.name and e.target.value
 * - Mobile: name and value directly from TextInput
 */

export type FormValues<T = Record<string, any>> = T

export interface UseFormStateReturn<T> {
  values: T
  setValue: (name: keyof T, value: any) => void
  setValues: React.Dispatch<React.SetStateAction<T>>
  resetForm: () => void
  setGeoLocation: (lat: number, lng: number) => void
  setGeoData: (address: string, city: string, state: string) => void
}

/**
 * Custom hook for form state management
 * Works across web and mobile platforms
 */
export function useFormState<T extends Record<string, any>>(
  initialValues: T
): UseFormStateReturn<T> {
  const [values, setValues] = useState<T>(initialValues)

  /**
   * Set a single form field value
   */
  const setValue = (name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  /**
   * Reset form to initial values
   */
  const resetForm = () => {
    setValues(initialValues)
  }

  /**
   * Set geolocation coordinates
   * Useful for property forms with location picker
   */
  const setGeoLocation = (lat: number, lng: number) => {
    setValues((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng
    } as T))
  }

  /**
   * Set geographic data (address, city, state)
   * Useful for reverse geocoding results
   */
  const setGeoData = (address: string, city: string, state: string) => {
    setValues((prev) => ({
      ...prev,
      address,
      city,
      state
    } as T))
  }

  return {
    values,
    setValue,
    setValues,
    resetForm,
    setGeoLocation,
    setGeoData
  }
}

export default useFormState
