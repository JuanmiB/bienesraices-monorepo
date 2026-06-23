import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native'
import { useAuthStore } from '@bienesraices/shared-logic'
import { router } from 'expo-router'
import { SymbolView } from 'expo-symbols'

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => {
            logout()
          },
        },
      ]
    )
  }

  const handleLogin = () => {
    // TODO: Navigate to login screen
    Alert.alert('Login', 'Pantalla de login próximamente')
  }

  const MenuItem = ({ icon, title, onPress, destructive }: any) => (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed
      ]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <SymbolView
          name={icon}
          size={22}
          tintColor={destructive ? '#dc2626' : '#059669'}
          style={styles.menuIcon}
        />
        <Text style={[styles.menuTitle, destructive && styles.menuTitleDestructive]}>
          {title}
        </Text>
      </View>
      <SymbolView
        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        size={18}
        tintColor="#9ca3af"
      />
    </Pressable>
  )

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.guestContainer}>
          <Text style={styles.guestIcon}>👤</Text>
          <Text style={styles.guestTitle}>Inicia sesión</Text>
          <Text style={styles.guestText}>
            Accede a tu cuenta para guardar favoritos, publicar propiedades y más
          </Text>

          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </Pressable>

          <Pressable style={styles.registerButton} onPress={handleLogin}>
            <Text style={styles.registerButtonText}>Crear cuenta</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <MenuItem
            icon={{ ios: 'info.circle', android: 'info', web: 'info' }}
            title="Acerca de"
            onPress={() => Alert.alert('Acerca de', 'Bienes Raíces v1.0.0')}
          />
          <MenuItem
            icon={{ ios: 'doc.text', android: 'description', web: 'description' }}
            title="Términos y condiciones"
            onPress={() => Alert.alert('Términos', 'Próximamente')}
          />
          <MenuItem
            icon={{ ios: 'lock.shield', android: 'privacy_tip', web: 'privacy_tip' }}
            title="Política de privacidad"
            onPress={() => Alert.alert('Privacidad', 'Próximamente')}
          />
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* User Header */}
      <View style={styles.userHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.nombre?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.nombre}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Main Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mi cuenta</Text>
        <MenuItem
          icon={{ ios: 'person.circle', android: 'account_circle', web: 'account_circle' }}
          title="Editar perfil"
          onPress={() => Alert.alert('Editar perfil', 'Próximamente')}
        />
        <MenuItem
          icon={{ ios: 'house.circle', android: 'home', web: 'home' }}
          title="Mis propiedades"
          onPress={() => Alert.alert('Mis propiedades', 'Próximamente')}
        />
        <MenuItem
          icon={{ ios: 'bell.circle', android: 'notifications', web: 'notifications' }}
          title="Notificaciones"
          onPress={() => Alert.alert('Notificaciones', 'Próximamente')}
        />
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración</Text>
        <MenuItem
          icon={{ ios: 'gear', android: 'settings', web: 'settings' }}
          title="Preferencias"
          onPress={() => Alert.alert('Preferencias', 'Próximamente')}
        />
        <MenuItem
          icon={{ ios: 'questionmark.circle', android: 'help', web: 'help' }}
          title="Ayuda y soporte"
          onPress={() => Alert.alert('Ayuda', 'Próximamente')}
        />
      </View>

      {/* Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        <MenuItem
          icon={{ ios: 'info.circle', android: 'info', web: 'info' }}
          title="Acerca de"
          onPress={() => Alert.alert('Acerca de', 'Bienes Raíces v1.0.0')}
        />
        <MenuItem
          icon={{ ios: 'doc.text', android: 'description', web: 'description' }}
          title="Términos y condiciones"
          onPress={() => Alert.alert('Términos', 'Próximamente')}
        />
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <MenuItem
          icon={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
          title="Cerrar sesión"
          onPress={handleLogout}
          destructive
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Bienes Raíces v1.0.0</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  guestIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  guestText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#059669',
  },
  registerButtonText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '700',
  },
  userHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemPressed: {
    opacity: 0.5,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  menuTitleDestructive: {
    color: '#dc2626',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
})
