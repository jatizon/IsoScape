from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="IsoScape API")

# CORS middleware para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured. Set it in .env or environment.")

# Configurar Gemini
genai.configure(api_key=GEMINI_API_KEY)


class CityRequest(BaseModel):
    city_name: str


@app.get("/")
def read_root():
    return {"message": "IsoScape API is running"}


@app.post("/generate-isometric")
async def generate_isometric(request: CityRequest):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')

        prompt = (
            "Create a colorful, futuristic isometric illustration of the city of "
            f"{request.city_name}. Highlight its skyline, iconic landmarks, and coastal "
            "or geographic context if applicable. Render in high detail with soft lighting."
        )

        response = model.generate_content(
            prompt,
            generation_config={
                "response_mime_type": "application/json",
            },
        )

        if not response.candidates:
            raise ValueError("Empty response from Gemini.")

        primary_candidate = response.candidates[0]
        parts = primary_candidate.content.parts if primary_candidate.content else []

        # Gemini pode devolver texto ou dados inline (base64). Tratamos os dois cenários.
        for part in parts:
            inline_data = getattr(part, "inline_data", None)
            if inline_data and inline_data.data:
                return {
                    "status": "success",
                    "city_name": request.city_name,
                    "image_base64": inline_data.data,
                    "message": "Isometric image generated",
                }

            text = getattr(part, "text", None)
            if text:
                return {
                    "status": "success",
                    "city_name": request.city_name,
                    "image_description": text,
                    "message": "Isometric description generated",
                }

        # Caso venha apenas um payload str serializado
        serialized = getattr(response, "text", None) or str(response)
        return {
            "status": "success",
            "city_name": request.city_name,
            "data": serialized,
            "message": "Response received but format was unexpected",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e)}")


@app.get("/health")
def health_check():
    return {"status": "healthy"}

