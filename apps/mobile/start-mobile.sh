#!/bin/bash

# Script para iniciar la app móvil correctamente
# Limpia procesos y caché antes de iniciar

echo "🧹 Limpiando procesos anteriores..."
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
lsof -ti:8082 | xargs kill -9 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true

echo "🗑️  Limpiando caché..."
rm -rf .expo
rm -rf node_modules/.cache

echo "🚀 Iniciando Expo..."
echo ""
npx expo start --clear

