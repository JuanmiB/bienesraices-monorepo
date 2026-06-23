import React from 'react'
import { SymbolView } from 'expo-symbols'
import { Tabs } from 'expo-router'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f3f4f6',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorar',
          headerTitle: 'Bienes Raíces',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 20,
            color: '#111827',
          },
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'house.fill',
                android: 'home',
                web: 'home',
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          headerTitle: 'Favoritos',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 20,
            color: '#111827',
          },
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'heart.fill',
                android: 'favorite',
                web: 'favorite',
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitle: 'Mi Perfil',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 20,
            color: '#111827',
          },
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'person.circle.fill',
                android: 'account_circle',
                web: 'account_circle',
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null, // Hide this tab from navigation
        }}
      />
    </Tabs>
  )
}
