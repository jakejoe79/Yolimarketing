#!/bin/bash

# test_local.sh
# Script para levantar todo localmente como en producción
# ✅ Requiere .env con OPENAI_API_KEY y demás variables

echo "🚀 Iniciando prueba local del MVP para Liz..."

# Verificar variable de entorno
if [ -z "$OPENAI_API_KEY" ]; then
  echo "❌ ERROR: OPENAI_API_KEY no está definido en .env"
  echo "Por favor, agrégalo antes de continuar."
  exit 1
fi

# Construir y levantar contenedores
echo "🔧 Construyendo y levantando backend y frontend..."
docker-compose up --build -d

# Esperar unos segundos a que los servicios estén activos
echo "⏳ Esperando 10 segundos para que backend y frontend inicien..."
sleep 10

# Mostrar URLs locales
echo "🌐 Frontend local: http://localhost:3000"
echo "🌐 Backend local: http://localhost:8000"

# Checklist de pruebas
echo ""
echo "📋 Checklist de pruebas:"
echo "1️⃣ Landing → Modal de bienvenida personalizado para Liz"
echo "2️⃣ Chat → Mensajes en español, verificar localStorage['art-chat']"
echo "3️⃣ Dashboard → Leads, cursos/eventos, campañas reflejadas"
echo "4️⃣ Generador de campañas → Usa art-courses y art-events"
echo "5️⃣ Rutas protegidas → /dashboard y /campaigns requieren login"
echo "6️⃣ Exportación CSV de leads (opcional)"
echo ""
echo "✅ Cuando termines, puedes detener todo con:"
echo "docker-compose down"
echo ""
echo "🎨 ¡Todo listo para probar el MVP local antes de enviar el regalo a Liz!"