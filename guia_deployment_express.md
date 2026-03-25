# 🚀 Guía Express de Deployment - Yolimarketing 🎨

## Paso 1: Variables de Entorno Reales

### Backend (.env)
```bash
cd backend
cp .env.example .env
# Editar .env con valores reales:
OPENAI_API_KEY=sk-your-real-openai-key
DATABASE_URL=postgresql://user:pass@host:port/db  # Si usas DB
REDIS_URL=redis://host:port  # Si usas Redis
CORS_ORIGINS=https://tu-frontend.vercel.app,https://escuelaarte.com
```

### Frontend (.env.local)
```bash
cd frontend
cp .env.example .env.local
# Editar:
VITE_BACKEND_URL=https://tu-backend-railway.up.railway.app
```

## Paso 2: Configurar CORS y HTTPS

### Backend - Actualizar CORS
En `server.py`, cambiar:
```python
app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)
```
Por:
```python
origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
app.add_middleware(CORSMiddleware, allow_origins=origins, ...)
```

### Frontend - Forzar HTTPS en producción
En `frontend/package.json`, agregar:
```json
"homepage": "https://tu-dominio.com"
```

## Paso 3: Test End-to-End

### Iniciar servicios
```bash
# Terminal 1 - Backend
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm start
```

### Pruebas manuales
- [ ] Abrir http://localhost:3000
- [ ] Modal de Liz aparece (solo primera vez)
- [ ] Chat responde en español, guarda en localStorage
- [ ] Login admin funciona (/login)
- [ ] Dashboard: crear curso/evento
- [ ] Ver curso/evento en landing
- [ ] Generar campaña con IA
- [ ] Captura de leads funciona

## Paso 4: Build y Push Final

### Build frontend
```bash
cd frontend
npm run build
```

### Verificar .gitignore
```bash
git status  # Debe mostrar solo archivos seguros
# NO debe mostrar .env, keys, etc.
```

### Commit y push
```bash
git add .
git commit -m "🚀 Deployment ready - modal Liz, env setup, CORS seguro"
git push origin main
```

## Paso 5: Deploy

### Backend (Railway)
1. Conectar repo GitHub
2. Variables de entorno en Railway dashboard
3. Deploy automático

### Frontend (Vercel)
1. Importar repo
2. Build settings: `npm run build`, output `build`
3. Environment: `VITE_BACKEND_URL=https://railway-url`
4. Deploy

## Paso 6: Verificación Final
- [ ] Frontend carga en Vercel
- [ ] Backend responde en Railway
- [ ] Chat funciona con OpenAI real
- [ ] Modal Liz aparece
- [ ] HTTPS activado
- [ ] No hay errores en console

## Opcional: Dockerizar Frontend

Si quieres contenedor unificado:

### Dockerfile para frontend
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose (backend + frontend)
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file: ./backend/.env
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
```

---

¡Listo para el regalo sorpresa de Liz! 🎁❤️

Tiempo estimado: 30-45 minutos