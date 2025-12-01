from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from src.agents.gemini_llm_agent import GeminiLlmAgent
from src.services.isometric_service import IsometricService
from src.controllers.isometric_controller import IsometricController
from src.models.schemas import CityRequest, IsometricResponse

# Load .env from backend directory (parent of src)
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

app = FastAPI(title="IsoScape API")

# CORS middleware para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicialização de dependências (Dependency Injection)
# Em produção, isso poderia ser feito com FastAPI Depends para melhor testabilidade
gemini_agent = GeminiLlmAgent()
isometric_service = IsometricService(gemini_agent)
isometric_controller = IsometricController(isometric_service)


@app.get("/")
def read_root():
    return {"message": "IsoScape API is running"}


@app.post("/generate-isometric", response_model=IsometricResponse)
async def generate_isometric(request: CityRequest):
    """
    Endpoint para gerar imagem isométrica de uma cidade.
    """
    return await isometric_controller.generate_isometric(request)


@app.get("/health")
def health_check():
    return {"status": "healthy"}
