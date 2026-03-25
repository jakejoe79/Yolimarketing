from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from pathlib import Path
import os
import json
from openai import AsyncOpenAI

load_dotenv(Path(__file__).parent / '.env')

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = AsyncOpenAI(api_key=os.environ['OPENAI_API_KEY'])

class CampaignRequest(BaseModel):
    budget: int
    dateRange: dict
    campaignType: str
    platforms: List[str]

@app.post("/api/generate-campaign")
async def generate_campaign(req: CampaignRequest):
    prompt = f"""Genera un calendario de publicaciones de 7 días para redes sociales de una escuela de arte.
Campaña: {req.campaignType}, Presupuesto: ${req.budget}, Plataformas: {', '.join(req.platforms)}
Rango de fechas: {req.dateRange.get('start')} a {req.dateRange.get('end')}

IMPORTANTE: Todo el contenido debe estar en ESPAÑOL.

Devuelve SOLO JSON válido:
{{"schedule":[{{"day":"Día 1 - Lunes","postTime":"9:00 AM","caption":"Caption cálido y artístico de 150-200 palabras EN ESPAÑOL...","hashtags":["#escueladearte","#creatividad",...8-12 hashtags relevantes]}},...7 días total]}}"""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Eres un experto en marketing de redes sociales para escuelas de arte. Responde SOLO en español. Devuelve solo JSON válido."},
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
