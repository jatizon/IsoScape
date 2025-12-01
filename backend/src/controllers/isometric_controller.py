from fastapi import HTTPException
from src.models.schemas import CityRequest, IsometricResponse
from src.services.isometric_service import IsometricService


class IsometricController:
    """
    Controller responsável por lidar com requisições HTTP relacionadas a isométricas.
    """

    def __init__(self, isometric_service: IsometricService):
        """
        Inicializa o controller com um serviço de isométricas.

        Args:
            isometric_service: Instância do serviço de isométricas
        """
        self.isometric_service = isometric_service

    async def generate_isometric(self, request: CityRequest) -> IsometricResponse:
        """
        Endpoint para gerar imagem isométrica de uma cidade.

        Args:
            request: Requisição contendo o nome da cidade

        Returns:
            Resposta com os dados da imagem gerada

        Raises:
            HTTPException: Se houver erro na geração
        """
        try:
            return await self.isometric_service.generate_isometric_city(request)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error generating image: {str(e)}"
            )

