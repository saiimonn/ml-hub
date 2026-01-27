from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from typing import Optional, List
from pydantic import BaseModel
from app.services.registry import get_metadata_by_id, list_all_models
from app.schemas.model import ModelDetail
from app.services.model_service import run_inference, run_color_detection

router = APIRouter(prefix = "/api/models", tags = ["Models"])

class ColorDetectionRequest(BaseModel):
    data: str  # hex color code

@router.get("/", response_model = List[ModelDetail])
async def get_models(category: Optional[str] = Query(None)):
    return list_all_models(category)
    
@router.get("/{model_id}", response_model=ModelDetail)
async def get_model_details(model_id: str):
    metadata = get_metadata_by_id(model_id)
    if not metadata:
        raise HTTPException(status_code=404, detail="Model metadata not found")
    return metadata
    
@router.post("/{model_id}/infer")
async def infer(
    model_id: str, 
    file: Optional[UploadFile] = File(None),
    data: Optional[str] = Form(None)  # Changed: Added Form() to explicitly declare as form field
):
    """
    Handle inference for different input types:
    - image: requires file upload
    - color: requires data (hex color code)
    """
    metadata = get_metadata_by_id(model_id)
    if not metadata:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Route based on input type
    if metadata.inputType == "image":
        if not file:
            raise HTTPException(
                status_code=400, 
                detail="Image file required for this model"
            )
        return await run_inference(model_id, file)
    
    elif metadata.inputType == "color":
        if not data:
            raise HTTPException(
                status_code=400, 
                detail="Color data required for this model"
            )
        if not file:
            raise HTTPException(
                status_code=400,
                detail="Image file required for color detection"
            )
        return await run_color_detection(model_id, file, data)
    
    else:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported input type: {metadata.inputType}"
        )