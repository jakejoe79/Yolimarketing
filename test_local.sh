#!/bin/bash

# 🧪 Script de Prueba Local - Yolimarketing 🎨
# Simula el entorno de producción localmente con Docker
# Uso: ./test_local.sh

set -e

echo "🎨 Yolimarketing - Prueba Local como Producción..."

# Verificar que .env existe y tiene OPENAI_API_KEY
if [ ! -f backend/.env ] || ! grep -q "OPENAI_API_KEY=sk-" backend/.env; then
    echo "❌ ERROR: backend/.env no existe o no tiene OPENAI_API_KEY válida"
    echo "   Copia backend/.env.example a .env y agrega tu clave real"
    exit 1
fi

# Verificar docker-compose.yml
if [ ! -f docker-compose.yml ]; then
    echo "❌ ERROR: docker-compose.yml no encontrado"
    exit 1
fi

echo "🐳 Levantando servicios con Docker Compose..."
docker-compose up --build -d

echo "⏳ Esperando que los servicios inicien (30s)..."
sleep 30

echo "✅ Servicios listos!"
echo ""
echo "🌐 URLs locales:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo ""
echo "🧪 Pruebas a realizar:"
echo "   1. Abre http://localhost:3000 → ¿Aparece modal de Liz?"
echo "   2. Prueba chat en español → ¿Guarda en localStorage?"
echo "   3. Ve a /login → ¿Dashboard funciona?"
echo "   4. Crea curso/evento → ¿Se refleja en landing?"
echo "   5. Genera campaña → ¿Usa contexto de cursos?"
echo ""
echo "🛑 Para detener: docker-compose down"
echo ""
echo "🎁 ¡Si todo funciona, está listo para producción!"