import cv2
import numpy as np
from .base import BaseCVModel

class EdgeDetectionModel(BaseCVModel):
    def load(self):
        return self
        
    def predict(self, image: np.ndarray) -> dict:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 100, 200)
        
        edge_pixels = int(np.sum(edges > 0))
        total_pixels = edges.size
        
        return {
            "type": "edge-detection",
            "edge_ratio": round(edge_pixels / total_pixels, 4),
            "message": "Edge detection successful"
        }
        
    def cleanup(self):
        pass