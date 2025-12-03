from pydantic import BaseModel


class LlmAgentConfig(BaseModel):
    model: str
    temperature: float
    max_tokens: int
    top_p: float | None = None
    stop_sequences: list[str] | None = None
    candidate_count: int | None = None
    resolution: str | None = None
    num_images: int | None = None