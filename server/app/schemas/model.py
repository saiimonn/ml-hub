from pydantic import BaseModel
from typing import Any, Dict, Optional

class InferenceMeta(BaseModel):
    inference_time_ms: float
    model_version: Optional[str] = None
    
class InferenceResponse(BaseModel):
    model_id: str
    output: Dict[str, Any]
    meta: InferenceMeta
    
class ModelDetail(BaseModel):
    id: str
    name: str
    description: str
    version: str
    type: str
    category: str
    inputType: str
    outputType: str