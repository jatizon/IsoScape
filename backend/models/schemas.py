from pydantic import BaseModel


class CityRequest(BaseModel):
    """Modelo de requisição para geração de cidade isométrica."""
    city_name: str


class IsometricResponse(BaseModel):
    """Modelo de resposta para geração isométrica."""
    status: str
    city_name: str
    message: str
    image_base64: str | None = None
    image_description: str | None = None
    data: str | None = None

