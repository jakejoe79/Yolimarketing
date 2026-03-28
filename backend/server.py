from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from pathlib import Path
import logging
import os
import json
import random
import re

load_dotenv(Path(__file__).parent / '.env')

logging.basicConfig(level=logging.INFO)
app = FastAPI()

# CORS accepted origins
cors_origins = os.environ.get('CORS_ORIGINS', '')
if cors_origins.strip() == '':
    origins = ["*"]
    allow_credentials = False
else:
    origins = [origin.strip() for origin in cors_origins.split(',') if origin.strip()]
    allow_credentials = True
    if len(origins) == 0:
        origins = ["*"]
        allow_credentials = False

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"], allow_credentials=allow_credentials)


def fake_ai_response(message, history=None, campaign_context=None):
    message_lower = message.lower()
    
    # Extract courses from campaign context
    courses = campaign_context.get("courses", []) if campaign_context else []
    
    # Intent detection (basic but effective)
    if "precio" in message_lower or "cuesta" in message_lower:
        return "Nuestras clases varían entre $300 y $800 MXN dependiendo del tipo. ¿Te gustaría una recomendación?"
    
    if "clase" in message_lower:
        if courses:
            course = courses[0]
            return f"Te recomiendo nuestro curso '{course.get('title', 'Sin título')}'. Es perfecto para empezar 🎨"
        return "Tenemos clases de pintura, dibujo y talleres creativos. ¿Quieres una clase de prueba gratis?"
    
    if "horario" in message_lower or "cuando" in message_lower:
        return "Tenemos horarios entre semana y fines de semana. ¿Qué días te interesan?"
    
    if "hola" in message_lower:
        return "¡Hola! 🎨 Me encanta que estés aquí. ¿Buscas clases o eventos?"
    
    if "correo" in message_lower or "email" in message_lower:
        return "Perfecto, ya guardé tu información. Te contactaremos pronto para agendar tu clase."
    
    # fallback
    responses = [
        "¡Qué buena pregunta! Déjame ayudarte con eso 😊",
        "Claro, te explico. Tenemos varias opciones dependiendo de lo que buscas.",
        "Eso suena genial, creo que te va a encantar nuestra escuela 🎨",
    ]
    return random.choice(responses)


def extract_lead(message):
    email_match = re.search(r"\S+@\S+\.\S+", message)
    name_match = re.search(r"me llamo (\w+)", message.lower())
    
    if email_match:
        return {
            "name": name_match.group(1).capitalize() if name_match else "Cliente",
            "email": email_match.group(0)
        }
    return None


class CampaignRequest(BaseModel):
    budget: int
    dateRange: dict
    campaignType: str
    platforms: List[str]
    campaignContext: Optional[dict] = None

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []
    campaignContext: Optional[dict] = None


@app.get("/")
async def root():
    return {"status": "ok", "message": "Yolimarketing backend is running"}

@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/chat")
async def chat(req: ChatRequest):
    message = req.message
    history = req.history
    campaign_context = req.campaignContext
    
    reply = fake_ai_response(message, history, campaign_context)
    
    # Check for lead extraction
    lead = extract_lead(message)
    
    return {
        "reply": reply,
        "action": "collect_lead" if lead else "general",
        "leadData": lead
    }


@app.post("/api/generate-campaign")
async def generate_campaign(req: CampaignRequest):
    # Build context from courses and events
    context_info = ""
    if req.campaignContext:
        courses = req.campaignContext.get("courses", [])
        events = req.campaignContext.get("events", [])
        
        if courses:
            context_info += "\n\nCURSOS DISPONIBLES:\n"
            for c in courses[:5]:
                context_info += f"- {c.get('title', 'Sin título')}: {c.get('description', '')} (${c.get('price', 'N/A')})\n"
        
        if events:
            context_info += "\nEVENTOS PRÓXIMOS:\n"
            for e in events[:5]:
                date_str = e.get('date', '')
                context_info += f"- {e.get('title', 'Sin título')}: {e.get('description', '')} ({date_str})\n"

    prompt = f"""Genera un calendario de publicaciones de 7 días para redes sociales de una escuela de arte.
Campaña: {req.campaignType}, Presupuesto: ${req.budget}, Plataformas: {', '.join(req.platforms)}
Rango de fechas: {req.dateRange.get('start')} a {req.dateRange.get('end')}
{context_info}
IMPORTANTE: 
- Todo el contenido debe estar en ESPAÑOL
- Si hay cursos o eventos disponibles, menciónalos naturalmente en los captions
- Los captions deben ser cálidos, artísticos y de 150-200 palabras
- Incluye llamadas a la acción relevantes

Devuelve SOLO JSON válido:
{{"schedule":[{{"day":"Día 1 - Lunes","postTime":"9:00 AM","caption":"Caption cálido y artístico de 150-200 palabras EN ESPAÑOL...","hashtags":["#escueladearte","#creatividad",...8-12 hashtags relevantes]}},...7 días total]}}"""

    try:
        # Simulated campaign generation (no OpenAI needed)
        schedule = []
        days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
        times = ["9:00 AM", "11:00 AM", "2:00 PM", "6:00 PM", "8:00 PM"]
        
        for i in range(7):
            course = req.campaignContext.get("courses", [{}])[0] if req.campaignContext else {}
            course_title = course.get("title", "Clase de Arte") if course else "Clase de Arte"
            
            schedule.append({
                "day": f"Día {i+1} - {days[i]}",
                "postTime": times[i % len(times)],
                "caption": f"Hola a todos! Hoy es un día perfecto para explorar tu creatividad. Nuestro curso '{course_title}' está disponible ahora. ¡Únete a nuestra comunidad artística! 🎨✨ #escueladearte #creatividad #arte #pintura #taller",
                "hashtags": ["#escueladearte", "#creatividad", "#arte", "#pintura", "#taller", "#aprende", "#artistamexico", "#cultura"]
            })
        
        return {
            "schedule": schedule,
            "type": req.campaignType,
            "budget": req.budget,
            "platforms": req.platforms,
            "dateRange": req.dateRange
        }
    except Exception as e:
        logging.exception('Campaign generation request failed')
        raise HTTPException(status_code=500, detail=str(e))
