import numpy as np
import cv2
from fastapi import UploadFile

async def read_image(file: UploadFile) -> np.ndarray:
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    if image is None:
        raise ValueError("Invalid Image")
        
    return image