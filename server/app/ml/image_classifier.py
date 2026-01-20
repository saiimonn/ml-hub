import base64
import cv2
import numpy as np
from app.ml.base import BaseCVModel
from sklearn.cluster import KMeans

class EdgeDetectionModel(BaseCVModel):
    def load(self):
        pass
    
    def predict(self, image: np.ndarray) -> dict:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 100, 200)

        _, buffer = cv2.imencode(".png", edges)
        encoded = base64.b64encode(buffer).decode("utf-8")

        edge_pixels = int(np.sum(edges > 0))
        total_pixels = edges.size

        return {
            "edge_ratio": round(edge_pixels / total_pixels, 4),
            "preview": encoded
        }
    
    def cleanup(self):
        pass
