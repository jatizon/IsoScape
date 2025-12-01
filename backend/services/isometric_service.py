from typing import Dict, Any
from agents.llm_agent_interface import LlmAgentInterface
from models.schemas import CityRequest, IsometricResponse


class IsometricService:
    """
    Serviço responsável pela lógica de negócio para geração de imagens isométricas.
    """

    def __init__(self, llm_agent: LlmAgentInterface):
        """
        Inicializa o serviço com um agente LLM.

        Args:
            llm_agent: Instância de um agente LLM que implementa LlmAgentInterface
        """
        self.llm_agent = llm_agent

    async def generate_isometric_city(self, request: CityRequest) -> IsometricResponse:
        """
        Gera uma imagem isométrica de uma cidade usando o agente LLM.

        Args:
            request: Requisição contendo o nome da cidade

        Returns:
            Resposta com os dados da imagem gerada

        Raises:
            ValueError: Se houver erro na geração
        """
        prompt = (
            "Create a colorful, futuristic isometric illustration of the city of "
            f"{request.city_name}. Highlight its skyline, iconic landmarks, and coastal "
            "or geographic context if applicable. Render in high detail with soft lighting."
        )

        generation_config = {
            "response_mime_type": "application/json",
        }

        response = await self.llm_agent.generate_content(prompt, generation_config)

        # Constrói a resposta baseada no tipo de conteúdo retornado
        if response.get("type") == "image":
            return IsometricResponse(
                status="success",
                city_name=request.city_name,
                image_base64=response.get("image_base64"),
                message="Isometric image generated",
            )
        elif response.get("type") == "text":
            return IsometricResponse(
                status="success",
                city_name=request.city_name,
                image_description=response.get("text"),
                message="Isometric description generated",
            )
        else:
            return IsometricResponse(
                status="success",
                city_name=request.city_name,
                data=response.get("data"),
                message="Response received but format was unexpected",
            )

