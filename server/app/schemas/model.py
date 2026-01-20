from pydantic import BaseModel
from typing import Any, Dict

class InferenceMeta(BaseModel):
    inference_time_ms: float
    
class InferenceResponse(BaseModel):
    model_id: str
    output: Dict[str, Any]
    meta: InferenceMeta