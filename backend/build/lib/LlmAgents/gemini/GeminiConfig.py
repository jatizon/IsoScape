from google.generativeai import types

gemini_config = {
    "model_name": "gemini-3-pro-preview",
    "content_config": types.GenerateContentConfig(
        temperature=1.0,
        media_resolution=types.MediaResolution.MEDIA_RESOLUTION_HIGH
    )
}
