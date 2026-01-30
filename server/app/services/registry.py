from typing import List, Optional
from app.ml.image_classifier import EdgeDetectionModel
from app.ml.color_analyzer import ColorAnalyzingModel
from app.ml.color_detector import ColorDetectorModel
from app.schemas.model import ModelDetail

MODEL_METADATA = {
    "edge-detector": {
        "id": "edge-detector",
        "name": "Edge Detector",
        "description": "Simple OpenCV edge detection model using Canny algorithms.",
        "version": "1.0",
        "type": "Computer Vision",
        "category": "analytical",
        "inputType": "image",
        "outputType": "non-camera"
    },
    "color-analyzer": {
        "id": "color-analyzer",
        "name": "Color Analyzer",
        "description": "Detects and analyzes dominant colors in images using K-means clustering. Lists up to 10 colors maximum.",
        "version": "1.3",
        "type": "CV/Analytics",
        "category": "analytical",
        "inputType": "image",
        "outputType": "non-camera"
    }, 
    "color-detector": {
        "id": "color-detector",
        "name": "Color Detector",
        "description": "Real-time color detection and tracking. Identifies and highlights specific colors based on user input",
        "version": "1.0",
        "type": "Computer Vision",
        "category": "analytical",
        "inputType": "color",
        "outputType": "camera"
    }
}

MODEL_REGISTRY = {
    "edge-detector": EdgeDetectionModel,
    "color-analyzer": ColorAnalyzingModel,
    "color-detector": ColorDetectorModel,
}

def list_all_models(category: Optional[str] = None) -> List[ModelDetail]:
    models = [ModelDetail(**data) for data in MODEL_METADATA.values()]
    if category:
        return [m for m in models if m.category == category]
    return models
    
def get_model(model_id: str):
    model_cls = MODEL_REGISTRY.get(model_id)
    if not model_cls:
        return None
    
    model = model_cls()
    model.load()
    return model

def get_metadata_by_id(model_id: str) -> Optional[ModelDetail]:
    data = MODEL_METADATA.get(model_id)
    return ModelDetail(**data) if data else None