#!/bin/bash

# 🚀 Script Express de Deployment - Yolimarketing 🎨
# Este script deja el proyecto listo para deployment sin fricciones

set -e  # Salir si hay error

echo "🎨 Yolimarketing - Preparando para Deployment..."

# 1. Variables de Entorno
echo "📝 Configurando variables de entorno..."

# Backend
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Copiado backend/.env.example a backend/.env"
    echo "⚠️  IMPORTANTE: Edita backend/.env con tus claves reales:"
    echo "   - OPENAI_API_KEY"
    echo "   - DATABASE_URL (si usas DB)"
    echo "   - REDIS_URL (si usas Redis)"
    echo "   - CORS_ORIGINS=https://tu-frontend.vercel.app"
else
    echo "✅ backend/.env ya existe"
fi

# Frontend
if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✅ Copiado frontend/.env.example a frontend/.env.local"
    echo "⚠️  IMPORTANTE: Edita frontend/.env.local con:"
    echo "   - VITE_BACKEND_URL=https://tu-backend-railway.up.railway.app"
else
    echo "✅ frontend/.env.local ya existe"
fi

# 2. Configurar HTTPS en Frontend
echo "🔒 Configurando HTTPS para producción..."
if ! grep -q '"homepage"' frontend/package.json; then
    # Agregar homepage (usuario debe cambiar el dominio)
    sed -i 's/"private": true,/"private": true,\n  "homepage": "https:\/\/tu-dominio.com",/' frontend/package.json
    echo "✅ Agregado homepage a package.json (cambia 'tu-dominio.com' por tu dominio real)"
else
    echo "✅ Homepage ya configurado en package.json"
fi

# 3. Verificar CORS en Backend
echo "🌐 Verificando CORS..."
if grep -q "CORS_ORIGINS" backend/server.py; then
    echo "✅ CORS configurado correctamente en backend"
else
    echo "⚠️  Revisa CORS en backend/server.py"
fi

# 4. Build Frontend
echo "🔨 Construyendo frontend..."
cd frontend
npm run build
cd ..
echo "✅ Frontend construido"

# 5. Test Backend (si tienes OPENAI_API_KEY)
echo "🧪 Probando backend..."
if [ -n "$OPENAI_API_KEY" ]; then
    ./test_backend.sh
    echo "✅ Tests de backend completados"
else
    echo "⚠️  OPENAI_API_KEY no configurada. Ejecuta manualmente: ./test_backend.sh"
fi

# 6. Verificar .gitignore
echo "🔍 Verificando que .env no esté en git..."
if git status --porcelain | grep -q "\.env"; then
    echo "❌ ERROR: .env está en git! Revisa .gitignore"
    exit 1
else
    echo "✅ .env no está en git"
fi

# 7. Commit Final
echo "📦 Preparando commit final..."
git add .
git status
echo "🚀 Commit listo. Ejecuta manualmente:"
echo "   git commit -m '🚀 Deployment ready - env setup, HTTPS, tests Liz'"
echo "   git push origin main"
echo ""
echo "🎁 ¡Listo para el regalo sorpresa de Liz!"

echo ""
echo "📋 Checklist final:"
echo "   - [ ] Variables de entorno reales configuradas"
echo "   - [ ] Backend desplegado (Railway/Heroku)"
echo "   - [ ] Frontend desplegado (Vercel/Netlify)"
echo "   - [ ] HTTPS activado"
echo "   - [ ] Modal Liz aparece en landing"
echo "   - [ ] Chat funciona con OpenAI"
echo "   - [ ] Dashboard y campañas operativas"