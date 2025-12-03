import os
import base64
import uuid
from google import genai
from core.interfaces.LllmAgentInterface import LlmAgentInterface
from core.schemas.LlmAgentResponse import LlmAgentResponse
from src.LlmAgents.gemini.GeminiConfig import gemini_config


class GeminiImageAgent(LlmAgentInterface):
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)
        self.gemini_config = gemini_config

    async def generate_content(self, prompt: str) -> LlmAgentResponse:
        response = self.client.models.generate_content(
            model=self.gemini_config["model_name"],
            contents=[prompt],
            config=self.gemini_config["content_config"]
        )

        if not response.candidates:
            raise ValueError("Empty response from Gemini.")

        primary_candidate = response.candidates[0]
        parts = primary_candidate.content.parts if primary_candidate.content else []

        image_base64 = None
        text = None

        for part in parts:
            inline_data = getattr(part, "inline_data", None)
            data_bytes = getattr(inline_data, "data", None)
            if isinstance(data_bytes, bytes):
                image_base64 = base64.b64encode(data_bytes).decode("utf-8")
                file_path = f"generated_image_{uuid.uuid4()}.png"
                with open(file_path, "wb") as f:
                    f.write(data_bytes)
            text = getattr(part, "text", None)

        return LlmAgentResponse(
            status="success",
            payload={},
            data={
                "image_base64": image_base64,
                "text": text,
            },
        )
