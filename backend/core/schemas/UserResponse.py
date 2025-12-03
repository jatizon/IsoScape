from pydantic import BaseModel
from typing import Any


class UserResponse(BaseModel):
    status: str
    data: dict[str, Any]