from pydantic import BaseModel
from typing import Any


class LlmAgentResponse(BaseModel):
    status: str
    payload: dict[str, Any]
    data: dict[str, Any]