from fastapi import APIRouter, Depends, HTTPException
import os
from dotenv import load_dotenv
from core.schemas.UserRequest import UserRequest
from core.schemas.UserResponse import UserResponse
from core.schemas.LlmAgentConfig import LlmAgentConfig
from core.interfaces.LllmAgentInterface import LlmAgentInterface
from src.handlers.ImageGenerationHandler import ImageGenerationHandler
from src.LlmAgents.gemini.GeminiImageAgent import GeminiImageAgent

router = APIRouter()

load_dotenv()

AGENT_TYPE = os.getenv("AGENT_TYPE", "gemini")
API_KEY = os.getenv(f"{AGENT_TYPE.upper()}_API_KEY")

def llm_agent_factory() -> LlmAgentInterface:
    if AGENT_TYPE.lower() == "gemini":
        return GeminiImageAgent(api_key=API_KEY)
    raise ValueError(f"Unknown AGENT_TYPE: {AGENT_TYPE}")


def image_generation_handler_factory(
    llm_agent: LlmAgentInterface = Depends(llm_agent_factory)
) -> ImageGenerationHandler:
    return ImageGenerationHandler(image_generation_agent=llm_agent)


@router.post("/generate-image", response_model=UserResponse)
async def generate_image(
    request: UserRequest, 
    image_generation_handler: ImageGenerationHandler = Depends(image_generation_handler_factory)
) -> UserResponse:
    try:
        return await image_generation_handler.generate_image(request)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating image: {str(e)}"
        )


@router.get("/")
def read_root():
    return {"message": "IsoScape API is running"}


@router.get("/health")
def health_check():
    return {"status": "healthy"}
