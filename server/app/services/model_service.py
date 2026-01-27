import time
from fastapi import UploadFile, HTTPException
from typing import Optional
from app.services.registry import get_model, get_metadata_by_id
from app.utils.image import read_image
from app.schemas.model import InferenceResponse, InferenceMeta

async def run_inference(model_id: str, file: UploadFile, color_data: Optional[str] = None):
    """
    Orchestrates the lifecycle of a model inference request:
    1. Validates existence of model and metadata.
    2. Instantiates the model class from the registry.
    3. Processes the input file.
    4. Executes prediction and benchmarks performance.
    5. Ensures resource cleanup.
    """
    
    # 1. Fetch Metadata and Model Class Reference
    metadata = get_metadata_by_id(model_id)
    model = get_model(model_id)

    if not model or not metadata:
        raise HTTPException(
            status_code=404, 
            detail=f"Model '{model_id}' not found in registry."
        )

    try:
        # 2. Prepare Input (Converts UploadFile to NumPy array/format)
        image = await read_image(file)
        
        # 3. Benchmark and Run Inference
        start_time = time.perf_counter()
        
        # Handle different input types
        if model_id == "color-detector" and color_data:
            # Color detector needs both image and color input
            result = model.predict(image, color_hex=color_data)
        else:
            # Standard image-only models
            result = model.predict(image)
        
        end_time = time.perf_counter()
        duration_ms = (end_time - start_time) * 1000

        # 4. Construct Structured Response for Frontend
        return InferenceResponse(
            model_id=model_id,
            output=result,
            meta=InferenceMeta(
                inference_time_ms=round(duration_ms, 2),
                model_version=metadata.version
            )
        )

    except Exception as e:
        # Catch ML execution errors specifically
        raise HTTPException(
            status_code=500, 
            detail=f"Inference failed for {model_id}: {str(e)}"
        )

    finally:
        # 5. Resource Cleanup (Release memory, close CV2 windows, etc.)
        if hasattr(model, 'cleanup'):
            model.cleanup()
            
async def run_color_detection(model_id: str, file: UploadFile, color_hex: str):
    metadata = get_metadata_by_id(model_id)
    model = get_model(model_id)
    
    if not model or not metadata:
        raise HTTPException(status_code=404, detail=f"Model '{model_id}' not found in registry")
        
    try:
        image = await read_image(file)
        
        if not color_hex.startswith('#') or len(color_hex) != 7:
            raise ValueError(f"Invalid color format: {color_hex}. Expected format: #RRGGBB")
        
        start_time = time.perf_counter()
        
        result = model.predict(image, color_hex=color_hex)
        
        end_time = time.perf_counter()
        duration_ms = (end_time - start_time) * 1000
        
        return InferenceResponse(
            model_id = model_id,
            output = result,
            meta = InferenceMeta(
                inference_time_ms = round(duration_ms, 2),
                model_version = metadata.version
            )
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Color detection failed for { model_id }: { str(e) }")
    finally:
        if hasattr(model, 'cleanup'):
            model.cleanup()