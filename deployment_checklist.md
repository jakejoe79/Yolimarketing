# Checklist de Deployment - Yolimarketing 🎨

## 1. Variables de Entorno y Secretos
- [x] **Backend (.env o Railway secrets)**:
  - [ ] OPENAI_API_KEY - clave real para chat IA y generador de campañas
  - [ ] Credenciales de DB si usas PostgreSQL
  - [ ] URL y auth de Redis/Upstash si hay caché de sesiones
- [x] **Frontend (Vercel / .env.local)**:
  - [ ] VITE_BACKEND_URL apuntando al backend desplegado
- [x] ✅ Asegurar que ninguna clave esté en GitHub, solo en env/config

## 2. Build y Optimización de Assets
- [x] **Frontend**: ejecutar build de producción
  - [x] `npm run build` o `yarn build`
  - [ ] Verificar que optimizaciones de Tailwind/React/Vite se aplican
  - [ ] Imágenes comprimidas
- [x] **Backend**: asegurar todas las dependencias Python en requirements.txt
  - [ ] Verificar assets estáticos copiados o enlazados correctamente

## 3. Routing y Configuración de Dominio
- [x] Backend CORS permite la URL de tu frontend Vercel (configurado con env)
- [ ] Opcional: agregar dominio (ej. escuelaarte.com) apuntando frontend + backend
- [ ] Asegurar BrowserRouter en frontend usa base path correcto si usas subpath de dominio

## 4. Manejo de Errores y Logging
- [ ] **Backend**: log de errores y requests, quizás Sentry o console + file logging
- [ ] **Frontend**: manejar llamadas API fallidas (red down, 401, 500)
  - [ ] UI fallback para chat si OpenAI API falla

## 5. Testing
- [ ] **End-to-end**:
  - [ ] Landing carga
  - [ ] Chat funciona en español, localStorage actualiza
  - [ ] Dashboard y campañas protegidos por login
  - [ ] Captura de leads + export CSV funciona
  - [ ] CRUD de cursos/eventos funciona y actualiza contexto de campaña
  - [ ] Probar en móvil y desktop (responsive)

## 6. Opcional pero Recomendado
- [ ] Favicon / branding
- [ ] Metadata SEO (título, descripción, OG tags)
- [ ] Skeletons o spinner de carga para generador de campaña
- [ ] Rate limiting / throttling para chat para evitar abuso

## 7. Configuración de Deployment
- [x] **Backend (Railway / Heroku / Render)**:
  - [x] Procfile o comando start correcto: `uvicorn server:app --host 0.0.0.0 --port $PORT`
  - [ ] Variables de entorno configuradas
  - [ ] DB y Redis conectados
  - [ ] HTTPS habilitado (Railway automático)
- [x] **Frontend (Vercel / Netlify)**:
  - [ ] VITE_BACKEND_URL apuntando al backend desplegado
  - [x] Build command: `npm run build` o `yarn build`
  - [x] Output directory: `build` (para CRA)
- [x] **CORS / Seguridad**:
  - [x] Backend solo acepta requests de tu frontend (con env)
  - [ ] HTTPS activado
  - [ ] Sanitizar inputs del chat y formularios

## 8. Chequeos Finales Antes de Go Live
- [ ] Links a redes sociales funcionan (Facebook/Instagram)
- [ ] Modal de bienvenida para Liz funciona correctamente
- [ ] Keys de localStorage funcionan en producción
- [ ] API key de OpenAI NO está en GitHub

---

¡Una vez marcado todo, estará listo para el regalo sorpresa de Liz! 🎁❤️