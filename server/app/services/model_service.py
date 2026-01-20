from app.services.registry import get_model
from app.utils.image import read_image
from app.schemas.model import InferenceResponse, InferenceMeta
from fastapi import UploadFile, HTTPException
import time

async def run_inference(model_id: str, file: UploadFile):
    model = get_model(model_id)

    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    try:
        image = await read_image(file)
        start = time.perf_counter()
        result = model.predict(image)
        duration = (time.perf_counter() - start) * 1000
        return InferenceResponse(
            model_id = model_id,
            output = result,
            meta = InferenceMeta(inference_time_ms=duration)
        )
    finally:
        model.cleanup()
