from abc import ABC, abstractmethod
from typing import Dict, Any, Optional


class LlmAgentInterface(ABC):
    """
    Interface abstrata para agentes de LLM.
    Define o contrato que todas as implementações de agentes de IA devem seguir.
    """

    @abstractmethod
    async def generate_content(
        self,
        prompt: str,
        generation_config: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Gera conteúdo baseado em um prompt.

        Args:
            prompt: O prompt de entrada para o modelo
            generation_config: Configurações opcionais para a geração

        Returns:
            Dict contendo a resposta do modelo com status e dados
        """
        pass

    @abstractmethod
    def is_configured(self) -> bool:
        """
        Verifica se o agente está configurado corretamente.

        Returns:
            True se configurado, False caso contrário
        """
        pass

