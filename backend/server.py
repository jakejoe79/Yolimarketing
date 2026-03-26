from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from pathlib import Path
import os
import json
from openai import AsyncOpenAI

load_dotenv(Path(__file__).parent / '.env')

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

api_key = os.environ.get('OPENAI_API_KEY')
if not api_key:
    print("WARNING: OPENAI_API_KEY not set. API calls will fail.")
    client = None
else:
    client = AsyncOpenAI(api_key=api_key)

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
    # Build campaign context string if available
    campaign_info = ""
    if req.campaignContext:
        campaign_info = f"""
Contexto de campaña activa:
- Tipo: {req.campaignContext.get('type', 'N/A')}
- Presupuesto: ${req.campaignContext.get('budget', 'N/A')}
- Plataformas: {', '.join(req.campaignContext.get('platforms', []))}
"""

    system_prompt = f"""Eres un asistente amable y entusiasta para una escuela de arte en español.
Tu rol es ayudar a los visitantes con información sobre clases, talleres y programas.

INSTRUCCIONES:
1. Responde SIEMPRE en español, de forma cálida y entusiasta.
2. Si el usuario menciona su nombre, correo o interés en una clase específica, extrae esa información.
3. Si preguntan por precios o horarios específicos, invítalos a dejar sus datos.
4. Menciona nuestras clases: Taller de Fin de Semana, Clase de Prueba Gratis, Intensivo de Temporada, Estudio Abierto.

{campaign_info}

EXTRACCIÓN DE LEADS:
Si el usuario proporciona información de contacto (nombre Y correo), responde con un JSON especial al FINAL de tu mensaje en este formato exacto:
[LEAD_DATA]{{"name": "nombre", "email": "correo@ejemplo.com", "interest": "clase de interés"}}[/LEAD_DATA]

Solo incluye LEAD_DATA si tienes TANTO nombre como correo válido."""

    messages = [{"role": "system", "content": system_prompt}]
    
    # Add history (handle both old and new format)
    for msg in req.history[-10:]:
        if msg.get("role") == "user":
            messages.append({"role": "user", "content": msg.get("message", msg.get("text", ""))})
        elif msg.get("role") == "ai":
            messages.append({"role": "assistant", "content": msg.get("message", msg.get("text", ""))})
        elif msg.get("sender") == "user":
            messages.append({"role": "user", "content": msg.get("text", msg.get("message", ""))})
        else:
            messages.append({"role": "assistant", "content": msg.get("text", msg.get("message", ""))})
    
    # Add current message
    messages.append({"role": "user", "content": req.message})
    
    if client is None:
        return {"reply": "Error: OPENAI_API_KEY no configurado en el servidor.", "action": "error"}
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.7,
            max_tokens=400
        )
        reply = response.choices[0].message.content.strip()
        
        # Check for lead data extraction
        action = "response"
        lead_data = None
        
        if "[LEAD_DATA]" in reply and "[/LEAD_DATA]" in reply:
            try:
                lead_json = reply.split("[LEAD_DATA]")[1].split("[/LEAD_DATA]")[0]
                lead_data = json.loads(lead_json)
                reply = reply.split("[LEAD_DATA]")[0].strip()
                action = "collect_lead"
            except:
                pass
        
        return {"reply": reply, "action": action, "leadData": lead_data}
    except Exception as e:
        return {"reply": "Lo siento, hubo un error. Por favor intenta de nuevo.", "action": "error"}

@app.post("/api/generate-campaign")
async def generate_campaign(req: CampaignRequest):
    # Build context from courses and events
    context_info = ""
    if req.campaignContext:
        courses = req.campaignContext.get("courses", [])
        events = req.campaignContext.get("events", [])
        
        if courses:
            context_info += "\n\nCURSOS DISPONIBLES:\n"
            for c in courses[:5]:  # Limit to 5
                context_info += f"- {c.get('title', 'Sin título')}: {c.get('description', '')} (${c.get('price', 'N/A')})\n"
        
        if events:
            context_info += "\nEVENTOS PRÓXIMOS:\n"
            for e in events[:5]:  # Limit to 5
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

    if client is None:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY no configurado en el servidor.")
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Eres un experto en marketing de redes sociales para escuelas de arte. Responde SOLO en español. Devuelve solo JSON válido. Personaliza el contenido basándote en los cursos y eventos disponibles."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8
        )
        
        text = response.choices[0].message.content.strip()
        if "```json" in text: text = text.split("```json")[1].split("```")[0]
        elif "```" in text: text = text.split("```")[1].split("```")[0]
        
        data = json.loads(text.strip())
        return {"schedule": data["schedule"], "type": req.campaignType, "budget": req.budget, "platforms": req.platforms, "dateRange": req.dateRange}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
