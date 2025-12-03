from pydantic import BaseModel
from typing import Any


class HandlerResponse(BaseModel):
    status: str
    data: dict[str, Any]	