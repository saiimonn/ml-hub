import base64
import cv2
import numpy as np
from app.ml.base import BaseCVModel
from PIL import Image

class ColorDetectorModel(BaseCVModel):
    def __init__(self):
        self.color_bgr = None
        
    def load(self):
        """Initialize the model (no pre-trained weights needed)"""
        pass
    
    def _hex_to_bgr(self, hex_color: str) -> tuple:
        """Convert hex color to BGR tuple for OpenCV"""
        # Remove '#' if present
        hex_color = hex_color.lstrip('#')
        
        # Convert hex to RGB
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        
        # Return as BGR for OpenCV
        return (b, g, r)
    
    def _get_limits(self, color_bgr: tuple) -> tuple:
        """
        Calculate HSV lower and upper limits for color detection.
        Handles red hue wrap-around.
        """
        c = np.uint8([[color_bgr]])  # BGR values
        hsvC = cv2.cvtColor(c, cv2.COLOR_BGR2HSV)
        hue = hsvC[0][0][0]  # Get the hue value
        
        # Handle red hue wrap-around
        if hue >= 165:  # Upper limit for divided red hue
            lowerLimit = np.array([hue - 10, 100, 100], dtype=np.uint8)
            upperLimit = np.array([180, 255, 255], dtype=np.uint8)
        elif hue <= 15:  # Lower limit for divided red hue
            lowerLimit = np.array([0, 100, 100], dtype=np.uint8)
            upperLimit = np.array([hue + 10, 255, 255], dtype=np.uint8)
        else:
            lowerLimit = np.array([hue - 10, 100, 100], dtype=np.uint8)
            upperLimit = np.array([hue + 10, 255, 255], dtype=np.uint8)
        
        return lowerLimit, upperLimit
    
    def predict(self, image: np.ndarray, color_hex: str = "#ff0000") -> dict:
        """
        Detect objects of specified color in the image.
        
        Args:
            image: Input image as numpy array (BGR format from OpenCV)
            color_hex: Hex color code to detect (e.g., "#ff0000" for red)
        
        Returns:
            dict containing detection results and annotated image
        """
        # Convert hex color to BGR
        color_bgr = self._hex_to_bgr(color_hex)
        
        # Convert image to HSV color space
        hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Get color limits
        lower_limit, upper_limit = self._get_limits(color_bgr)
        
        # Create mask - white where color is detected, black elsewhere
        mask = cv2.inRange(hsv_image, lower_limit, upper_limit)
        
        # Find bounding box of detected color
        mask_pil = Image.fromarray(mask)
        bbox = mask_pil.getbbox()
        
        # Create annotated image
        annotated_image = image.copy()
        detection_found = False
        bbox_coords = None
        
        if bbox is not None:
            detection_found = True
            x1, y1, x2, y2 = bbox
            bbox_coords = {"x1": int(x1), "y1": int(y1), "x2": int(x2), "y2": int(y2)}
            
            # Draw rectangle on the image
            cv2.rectangle(annotated_image, (x1, y1), (x2, y2), (0, 255, 0), 3)
            
            # Add label with color
            label = f"Color: {color_hex.upper()}"
            cv2.putText(
                annotated_image, 
                label, 
                (x1, y1 - 10), 
                cv2.FONT_HERSHEY_SIMPLEX, 
                0.6, 
                (0, 255, 0), 
                2
            )
        
        # Encode annotated image to base64
        _, buffer = cv2.imencode(".png", annotated_image)
        annotated_encoded = base64.b64encode(buffer).decode("utf-8")
        
        # Encode mask for debugging
        _, mask_buffer = cv2.imencode(".png", mask)
        mask_encoded = base64.b64encode(mask_buffer).decode("utf-8")
        
        # Calculate detection coverage
        total_pixels = mask.size
        detected_pixels = int(np.sum(mask > 0))
        coverage_percentage = round((detected_pixels / total_pixels) * 100, 2)
        
        return {
            "detection_found": detection_found,
            "color_detected": color_hex.upper(),
            "color_bgr": color_bgr,
            "bounding_box": bbox_coords,
            "coverage_percentage": coverage_percentage,
            "detected_pixels": detected_pixels,
            "annotated_image": annotated_encoded,
            "mask": mask_encoded
        }
    
    def cleanup(self):
        """Clean up resources"""
        pass