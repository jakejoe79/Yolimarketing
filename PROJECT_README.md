# Yolimarketing - Escuela de Arte Online 🎨

Una plataforma web para una escuela de arte, con chat IA, gestión de campañas de marketing, calendario de eventos y más.

## Características

- **Landing Page**: Página de inicio con captura de leads
- **Chat IA**: Asistente en español para consultas sobre clases
- **Dashboard**: Panel de administración para cursos, eventos y campañas
- **Generador de Campañas**: Crea campañas de marketing con IA

## Tecnologías

- **Frontend**: React + Vite, Tailwind CSS, Radix UI
- **Backend**: FastAPI + Python, OpenAI API
- **Base de datos**: LocalStorage (para demo), PostgreSQL para producción

## Instalación y Desarrollo

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Configurar variables
uvicorn server:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Deployment

Ver el [checklist de deployment](deployment_checklist.md) para pasos detallados.

### Backend (Railway/Heroku)

- Variables de entorno en plataforma
- Comando: `uvicorn server:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel/Netlify)

- Build command: `npm run build`
- Output: `build`
- Variable: `VITE_BACKEND_URL` apuntando al backend

## Contribución

1. Fork el repo
2. Crea una branch
3. Commit cambios
4. Push y PR

## Licencia

MIT