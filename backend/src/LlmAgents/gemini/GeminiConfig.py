from google.genai import types

# Config global para toda a requisição
gemini_config = {
    "model_name": "gemini-3-pro-image-preview",
    # "model_name": "gemini-2.5-flash-image",
    "content_config": types.GenerateContentConfig(
        temperature=1.0,
    )
}
