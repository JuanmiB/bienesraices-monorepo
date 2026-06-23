import React from 'react'
import { View, TextInput, Pressable, StyleSheet } from 'react-native'
import { SymbolView } from 'expo-symbols'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  onSubmit?: () => void
  placeholder?: string
}

export function SearchBar({ value, onChangeText, onSubmit, placeholder = 'Buscar propiedades...' }: SearchBarProps) {
  const handleClear = () => {
    onChangeText('')
  }

  return (
    <View style={styles.container}>
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        size={20}
        tintColor="#9ca3af"
        style={styles.searchIcon}
      />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />

      {value.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <SymbolView
            name={{ ios: 'xmark.circle.fill', android: 'close', web: 'close' }}
            size={18}
            tintColor="#9ca3af"
          />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    padding: 4,
  },
})
