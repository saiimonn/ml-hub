from app.ml.image_classifier import EdgeDetectionModel, ColorDetectionModel

MODEL_REGISTRY = {
    "edge-detector": EdgeDetectionModel,
    "color-detector": ColorDetectionModel,
}

def get_model(model_id: str):
    model_cls = MODEL_REGISTRY.get(model_id)
    if not model_cls:
        return None
        
    model = model_cls()
    model.load()
    return model