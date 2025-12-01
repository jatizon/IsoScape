import os
from typing import Dict, Any, Optional
import google.generativeai as genai
from src.agents.llm_agent_interface import LlmAgentInterface


class GeminiLlmAgent(LlmAgentInterface):
    """
    Implementação do agente LLM usando Google Gemini.
    """

    def __init__(self, api_key: Optional[str] = None, model_name: str = "gemini-2.5-flash-image"):
        """
        Inicializa o agente Gemini.

        Args:
            api_key: Chave da API do Gemini. Se None, tenta obter de variável de ambiente
            model_name: Nome do modelo Gemini a ser usado
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model_name = model_name
        self._configured = False

        if self.api_key:
            genai.configure(api_key=self.api_key)
            self._configured = True
        else:
            raise RuntimeError("GEMINI_API_KEY is not configured. Set it in .env or environment.")

    async def generate_content(
        self,
        prompt: str,
        generation_config: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Gera conteúdo usando o modelo Gemini.

        Args:
            prompt: O prompt de entrada
            generation_config: Configurações opcionais (padrão: JSON response)

        Returns:
            Dict com status, dados e informações da resposta
        """
        if not self._configured:
            raise RuntimeError("Gemini agent is not configured properly.")

        model = genai.GenerativeModel(self.model_name)

        # For image generation models, we don't need generation_config
        # Only pass it if explicitly provided and not empty
        if generation_config:
            response = model.generate_content(prompt, generation_config=generation_config)
        else:
            response = model.generate_content(prompt)

        if not response.candidates:
            raise ValueError("Empty response from Gemini.")

        primary_candidate = response.candidates[0]
        parts = primary_candidate.content.parts if primary_candidate.content else []

        # Processa diferentes tipos de resposta (imagem base64, texto, etc)
        for part in parts:
            inline_data = getattr(part, "inline_data", None)
            if inline_data and inline_data.data:
                return {
                    "status": "success",
                    "image_base64": inline_data.data,
                    "type": "image",
                }

            text = getattr(part, "text", None)
            if text:
                return {
                    "status": "success",
                    "text": text,
                    "type": "text",
                }

        # Fallback para resposta serializada
        serialized = getattr(response, "text", None) or str(response)
        return {
            "status": "success",
            "data": serialized,
            "type": "raw",
        }

    def is_configured(self) -> bool:
        """
        Verifica se o agente Gemini está configurado.

        Returns:
            True se configurado, False caso contrário
        """
        return self._configured

