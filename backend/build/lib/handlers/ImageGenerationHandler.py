from core.interfaces.LllmAgentInterface import LlmAgentInterface
from core.schemas.UserRequest import UserRequest
from core.schemas.UserResponse import UserResponse


class ImageGenerationHandler:

    def __init__(self, image_generation_agent: LlmAgentInterface):
        self.image_generation_agent = image_generation_agent

    async def generate_image(self, request: UserRequest) -> UserResponse:
        response = await self.image_generation_agent.generate_content(request.prompt)
        return UserResponse(
            status=response.status,
            data=response.data
        )