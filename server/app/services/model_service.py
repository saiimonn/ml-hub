from app.services.registry import get_model
from app.utils.image import read_image
from fastapi import UploadFile, HTTPException

async def run_inference(model_id: str, file: UploadFile):
    model = get_model(model_id)

    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    try:
        image = await read_image(file)
        result = model.predict(image)
        return result
    finally:
        model.cleanup()
