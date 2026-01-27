from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from typing import Optional, List
from app.services.registry import get_metadata_by_id, list_all_models
from app.schemas.model import ModelDetail
from app.services.model_service import run_inference

router = APIRouter(prefix = "/api/models", tags = ["Models"])

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
    file: UploadFile = File(...),
    color_data: Optional[str] = Form(None)    
):
    return await run_inference(model_id, file, color_data=color_data)