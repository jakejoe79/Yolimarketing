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
    prompt = f"""Generate a 7-day social media posting schedule for an art school campaign.
Campaign: {req.campaignType}, Budget: ${req.budget}, Platforms: {', '.join(req.platforms)}
Date range: {req.dateRange.get('start')} to {req.dateRange.get('end')}

Return ONLY valid JSON:
{{"schedule":[{{"day":"Day 1 - Monday","postTime":"9:00 AM","caption":"150-200 word warm art-focused caption...","hashtags":["#artschool","#creativity",...8-12 tags]}},...7 days total]}}"""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an art school social media expert. Return only valid JSON."},
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
