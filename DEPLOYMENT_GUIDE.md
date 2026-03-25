# Yolimarketing Deployment Guide

## Prerequisites
- GitHub account
- OpenAI API key
- Accounts on deployment platforms (Railway/Render for backend, Vercel/Netlify for frontend)

---

## Step 1: Backend Deployment (Railway or Render)

### Railway Deployment
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select repository: `jakejoe79/Yolimarketing`
5. Select the `backend` folder
6. Set environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `CORS_ORIGINS`: Your frontend URL (e.g., `https://your-app.vercel.app`)
7. Click "Deploy"

### Render Deployment
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect repository: `jakejoe79/Yolimarketing`
5. Set build command: `pip install -r requirements.txt`
6. Set start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
7. Add environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `CORS_ORIGINS`: Your frontend URL
8. Click "Create Web Service"

---

## Step 2: Frontend Deployment (Vercel or Netlify)

### Vercel Deployment
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import repository: `jakejoe79/Yolimarketing`
5. Select the `frontend` folder
6. Set environment variables:
   - `VITE_BACKEND_URL`: Your backend URL (e.g., `https://your-backend.railway.app`)
7. Click "Deploy"

### Netlify Deployment
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect repository: `jakejoe79/Yolimarketing`
5. Set build settings:
   - Build command: `npm run build` or `yarn build`
   - Publish directory: `build`
6. Add environment variable:
   - `VITE_BACKEND_URL`: Your backend URL
7. Click "Deploy site"

---

## Step 3: Update CORS After Frontend Deploys

Once your frontend is deployed:
1. Copy your frontend URL (e.g., `https://your-app.vercel.app`)
2. Go to your backend deployment (Railway/Render)
3. Update the `CORS_ORIGINS` environment variable to include your frontend URL
4. Redeploy the backend

---

## Step 4: Test Your Deployment

1. Visit your frontend URL
2. Test the chat functionality
3. Test the campaign generator
4. Verify all API calls are working

---

## Environment Variables Reference

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `CORS_ORIGINS` | Comma-separated list of allowed origins | Yes |
| `HOST` | Server host (default: 0.0.0.0) | No |
| `PORT` | Server port (default: 8000) | No |

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_BACKEND_URL` | URL of your deployed backend | Yes |

---

## Troubleshooting

### Backend won't start
- Check that `OPENAI_API_KEY` is set correctly
- Verify `requirements.txt` has all dependencies

### Frontend can't connect to backend
- Check `VITE_BACKEND_URL` is correct
- Verify `CORS_ORIGINS` includes your frontend URL
- Check browser console for CORS errors

### Chat not working
- Verify OpenAI API key is valid
- Check backend logs for errors
