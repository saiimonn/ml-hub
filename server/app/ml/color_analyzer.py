import base64
import cv2
import numpy as np
from app.ml.base import BaseCVModel
from sklearn.cluster import KMeans

class ColorAnalyzingModel(BaseCVModel):
    def __init__(self, n_colors=5):
        self.n_colors = n_colors
    
    def load(self):
        pass
    
    def predict(self, image: np.ndarray) -> dict:
        # Convert from BGR to RGB for proper color representation
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Reshape image to be a list of pixels
        pixels = image_rgb.reshape(-1, 3)
        
        # Use KMeans to find dominant colors
        kmeans = KMeans(n_clusters=self.n_colors, random_state=42, n_init=10)
        kmeans.fit(pixels)
        
        # Get the colors and their counts
        colors = kmeans.cluster_centers_.astype(int)
        labels = kmeans.labels_
        counts = np.bincount(labels)
        
        # Calculate percentages
        total_pixels = len(pixels)
        percentages = (counts / total_pixels * 100).round(2)
        
        # Sort colors by frequency
        sorted_indices = np.argsort(counts)[::-1]
        
        # Prepare color data
        color_data = []
        for idx in sorted_indices:
            color_rgb = colors[idx].tolist()
            color_hex = '#{:02x}{:02x}{:02x}'.format(color_rgb[0], color_rgb[1], color_rgb[2])
            color_data.append({
                "hex": color_hex,
                "rgb": color_rgb,
                "percentage": float(percentages[idx])
            })
        
        # Create a visualization with color bars
        bar_height = 100
        bar_width = image.shape[1]
        color_bar = np.zeros((bar_height, bar_width, 3), dtype=np.uint8)
        
        x_offset = 0
        for idx in sorted_indices:
            segment_width = int(bar_width * percentages[idx] / 100)
            color_bgr = colors[idx][::-1]  # Convert RGB to BGR for OpenCV
            color_bar[:, x_offset:x_offset+segment_width] = color_bgr
            x_offset += segment_width
        
        # Encode the color bar visualization
        _, buffer = cv2.imencode(".png", color_bar)
        encoded = base64.b64encode(buffer).decode("utf-8")
        
        return {
            "colors": color_data,
            "dominant_color": color_data[0]["hex"],
            "preview": encoded,
            "total_colors_detected": len(color_data)
        }
    
    def cleanup(self):
        pass