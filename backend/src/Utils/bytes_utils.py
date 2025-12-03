import base64

def save_bytes_as_image(data_bytes: bytes):
    with open("generated_image.png", "wb") as f:
        f.write(data_bytes)