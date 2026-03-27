# 🚀 Checklist Final de Pre-Deploy - Yolimarketing 🎨

## ✅ Antes de Desplegar

### 1. Variables de Entorno Reales
- [ ] **Backend (.env)**:
  - [ ] `OPENAI_API_KEY=sk-tu-clave-real`
  - [ ] `DATABASE_URL=postgresql://...` (si usas DB)
  - [ ] `REDIS_URL=redis://...` (si usas Redis)
  - [ ] `CORS_ORIGINS=https://tu-frontend.vercel.app`
- [ ] **Frontend (.env.local)**:
  - [ ] `REACT_APP_BACKEND_URL=https://tu-backend-railway.up.railway.app`
  - [ ] `VITE_BACKEND_URL=https://tu-backend-railway.up.railway.app`

### 2. Prueba Local Completa
- [ ] Ejecuta `./test_local_extended.sh`
- [ ] Verifica que Docker levante sin errores
- [ ] Navegador se abre automáticamente
- [ ] Modal de Liz aparece en landing
- [ ] Chat funciona en español y guarda en localStorage
- [ ] Dashboard accesible con login
- [ ] CRUD de cursos/eventos funciona
- [ ] Generador de campañas usa contexto
- [ ] Export CSV de leads (opcional)

### 3. Build de Producción
- [ ] `cd frontend && npm run build` (sin errores)
- [ ] Verifica que `build/` tenga archivos optimizados

### 4. Seguridad y Configuración
- [ ] `.env` NO está en Git (verifica con `git status`)
- [ ] `homepage` en `package.json` apunta a tu dominio (ej: `"homepage": "https://escuelaarte.com"`)
- [ ] CORS en backend permite solo tu frontend

## 🚀 Despliegue Paso a Paso

### Backend (Railway / Render / Heroku)
1. [ ] Sube código a GitHub: `git push origin main`
2. [ ] Conecta repo en plataforma
3. [ ] Configura variables de entorno en dashboard
4. [ ] Despliega y obtén URL (ej: `https://yoli-backend.up.railway.app`)
5. [ ] Prueba endpoint: `curl https://tu-backend/api/chat`

### Frontend (Vercel / Netlify)
1. [ ] Actualiza `VITE_BACKEND_URL` en `.env.local` con URL del backend
2. [ ] Sube código a GitHub (si no lo hiciste)
3. [ ] Importa repo en Vercel/Netlify
4. [ ] Configura build: `npm run build`, output `build`
5. [ ] Despliega y obtén URL final

## 🧪 Pruebas en Producción
- [ ] Landing carga y modal Liz aparece
- [ ] Chat responde en español
- [ ] Dashboard protegido por login
- [ ] Cursos/eventos se reflejan
- [ ] Campañas se generan con IA
- [ ] HTTPS activado
- [ ] No hay errores en console

## 🎁 ¡Listo para Liz!
- [ ] Envía el link de producción
- [ ] Confirma que todo funciona en su navegador

### 💖 Mientras Liz lo ve (notas divertidas)
- [ ] 😍 Modal personalizado aparece: "¡Bienvenida Liz! Tu escuela de arte te espera"
- [ ] 💬 Chat responde en español con entusiasmo
- [ ] 📅 Cursos como "Taller de Fin de Semana" listos
- [ ] 🎨 Campañas generadas con IA para redes sociales
- [ ] 🔐 Dashboard protegido, pero fácil de usar
- [ ] 📊 Export CSV de leads para sus contactos
- [ ] ✨ Todo fluye sin bugs ni delays
- [ ] ¡Sorpresa perfecta! ❤️🎨

---

**Tiempo estimado**: 20-30 minutos  
**Plataformas recomendadas**: Railway (backend) + Vercel (frontend)