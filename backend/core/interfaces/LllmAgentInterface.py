from abc import ABC, abstractmethod
from core.schemas.LlmAgentResponse import LlmAgentResponse
from core.schemas.LlmAgentConfig import LlmAgentConfig


class LlmAgentInterface(ABC):

    @abstractmethod
    async def generate_content(self, prompt: str) -> LlmAgentResponse:
        pass


