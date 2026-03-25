#!/bin/bash

# test_local_extended.sh
# Versión extendida: abre navegador automáticamente y checklist con colores
# Script para levantar todo localmente como en producción

# Colores para terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🚀 Iniciando prueba local EXTENDIDA del MVP para Liz..."

# Verificar variable de entorno
if [ ! -f backend/.env ] || ! grep -q "OPENAI_API_KEY=sk-" backend/.env; then
  echo -e "${RED}❌ ERROR: backend/.env no existe o no tiene OPENAI_API_KEY válida${NC}"
  echo "Por favor, agrégalo antes de continuar."
  exit 1
fi

# Construir y levantar contenedores
echo "🔧 Construyendo y levantando backend y frontend..."
docker-compose up --build -d

# Esperar unos segundos a que los servicios estén activos
echo "⏳ Esperando 15 segundos para que backend y frontend inicien..."
sleep 15

# Mostrar URLs locales
echo -e "${GREEN}✅ Servicios listos!${NC}"
echo ""
echo -e "${BLUE}🌐 Frontend local: http://localhost:3000${NC}"
echo -e "${BLUE}🌐 Backend local: http://localhost:8000${NC}"
echo ""

# Abrir navegador automáticamente
echo "🌍 Abriendo navegador en http://localhost:3000..."
if command -v xdg-open > /dev/null; then
  xdg-open http://localhost:3000
elif [ -n "$BROWSER" ]; then
  "$BROWSER" http://localhost:3000
else
  echo -e "${YELLOW}⚠️  No se pudo abrir navegador automáticamente. Abre manualmente: http://localhost:3000${NC}"
fi

# Checklist de pruebas con colores
echo ""
echo -e "${YELLOW}📋 Checklist de pruebas (marca manualmente):${NC}"
echo -e "1️⃣  ${BLUE}Landing → Modal de bienvenida personalizado para Liz${NC}"
echo -e "2️⃣  ${BLUE}Chat → Mensajes en español, verificar localStorage['art-chat']${NC}"
echo -e "3️⃣  ${BLUE}Dashboard → Leads, cursos/eventos, campañas reflejadas${NC}"
echo -e "4️⃣  ${BLUE}Generador de campañas → Usa art-courses y art-events${NC}"
echo -e "5️⃣  ${BLUE}Rutas protegidas → /dashboard y /campaigns requieren login${NC}"
echo -e "6️⃣  ${BLUE}Exportación CSV de leads (opcional)${NC}"
echo ""
echo -e "${GREEN}✅ Cuando termines todas las pruebas, detén todo con:${NC}"
echo "docker-compose down"
echo ""
echo -e "${GREEN}🎨 ¡Todo listo para probar el MVP local antes de enviar el regalo a Liz!${NC}"