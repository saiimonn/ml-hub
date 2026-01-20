from fastapi import APIRouter, UploadFile, File
from app.services.model_service import run_inference

router = APIRouter(prefix="/models", tags=["Models"])

@router.get("/")
def list_models():
    return [
        {
            "id": "edge-detector",
            "name": "Edge Detector",
            "description": "Simple OpenCV edge detection model"
        },

        {
            "id": "color-analyzer",
            "name": "Color Analyzer",
            "description": "Detects and analyzes dominant colors in images using K-means clustering"
        }
    ]

@router.post("/{model_id}/infer")
async def infer(model_id: str, file: UploadFile = File(...)):
    return await run_inference(model_id, file)