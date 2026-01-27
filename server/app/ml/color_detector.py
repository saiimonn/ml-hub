import base64
import cv2
import numpy as np
from app.ml.base import BaseCVModel

class ColorDetectionModel(BaseCVModel):
    
    def __init__(self, tolerance=30):
        self.tolerance = tolerance
        self.target_color_bgr = None
    
    def load(self):
        pass
    
    def hex_to_bgr(self, hex_color: str) -> np.ndarray:

        hex_color = hex_color.lstrip('#')
        r, g, b = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
        return np.array([b, g, r], dtype=np.uint8)
    
    def predict(self, image: np.ndarray, color_hex: str) -> dict:
        # Convert hex color to BGR
        self.target_color_bgr = self.hex_to_bgr(color_hex)
        
        # Create color mask bounds
        lower_bound = np.clip(self.target_color_bgr - self.tolerance, 0, 255)
        upper_bound = np.clip(self.target_color_bgr + self.tolerance, 0, 255)
        
        # Create mask for the target color
        mask = cv2.inRange(image, lower_bound, upper_bound)
        
        # Apply morphological operations to reduce noise
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        # Find contours of detected color regions
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Create visualization with detected regions highlighted
        result_image = image.copy()
        
        # Draw contours and bounding boxes
        detected_regions = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if area > 100:  # Filter small noise
                # Draw contour in green
                cv2.drawContours(result_image, [contour], -1, (0, 255, 0), 2)
                
                # Get bounding rectangle
                x, y, w, h = cv2.boundingRect(contour)
                cv2.rectangle(result_image, (x, y), (x + w, y + h), (0, 255, 0), 2)
                
                # Add label with area
                label = f"{int(area)}px"
                cv2.putText(result_image, label, (x, y - 5), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
                
                detected_regions.append({
                    "x": int(x),
                    "y": int(y),
                    "width": int(w),
                    "height": int(h),
                    "area": int(area)
                })
        
        # Create a colored overlay showing detection mask
        colored_mask = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
        overlay = cv2.addWeighted(result_image, 0.7, colored_mask, 0.3, 0)
        
        # Calculate detection statistics
        total_pixels = image.shape[0] * image.shape[1]
        detected_pixels = np.sum(mask > 0)
        coverage_percentage = (detected_pixels / total_pixels) * 100
        
        # Encode result image with overlay
        _, buffer = cv2.imencode(".png", overlay)
        encoded_result = base64.b64encode(buffer).decode("utf-8")
        
        # Encode original with contours only
        _, buffer_contours = cv2.imencode(".png", result_image)
        encoded_contours = base64.b64encode(buffer_contours).decode("utf-8")
        
        # Encode mask
        _, buffer_mask = cv2.imencode(".png", mask)
        encoded_mask = base64.b64encode(buffer_mask).decode("utf-8")
        
        return {
            "preview": encoded_result,
            "contours_only": encoded_contours,
            "mask": encoded_mask,
            "target_color": {
                "hex": color_hex,
                "rgb": [int(self.target_color_bgr[2]), 
                       int(self.target_color_bgr[1]), 
                       int(self.target_color_bgr[0])]
            },
            "detection_stats": {
                "regions_found": len(detected_regions),
                "coverage_percentage": round(coverage_percentage, 2),
                "detected_pixels": int(detected_pixels),
                "total_pixels": int(total_pixels)
            },
            "regions": sorted(detected_regions, key=lambda x: x['area'], reverse=True)[:10]
        }
    
    def cleanup(self):
        pass