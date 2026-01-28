import base64
import cv2
import numpy as np
from app.ml.base import BaseCVModel
from PIL import Image

class ColorDetectorModel(BaseCVModel):
    def __init__(self):
        self.color_bgr = None
        # Cache for HSV conversion to avoid repeated calculations
        self._hsv_cache = {}
        
    def load(self):
        """Initialize the model (no pre-trained weights needed)"""
        pass
    
    def _hex_to_bgr(self, hex_color: str) -> tuple:
        """Convert hex color to BGR tuple for OpenCV"""
        # Cache hex to BGR conversions
        if hex_color in self._hsv_cache:
            return self._hsv_cache[hex_color]['bgr']
        
        # Remove '#' if present
        hex_color = hex_color.lstrip('#')
        
        # Convert hex to RGB
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        
        # Return as BGR for OpenCV
        bgr = (b, g, r)
        
        # Cache the result
        if hex_color not in self._hsv_cache:
            self._hsv_cache[hex_color] = {'bgr': bgr}
        
        return bgr
    
    def _get_limits(self, color_bgr: tuple) -> tuple:
        """
        Calculate HSV lower and upper limits for color detection.
        Handles red hue wrap-around with caching.
        """
        # Check cache first
        cache_key = str(color_bgr)
        if cache_key in self._hsv_cache and 'limits' in self._hsv_cache[cache_key]:
            return self._hsv_cache[cache_key]['limits']
        
        c = np.uint8([[color_bgr]])  # BGR values
        hsvC = cv2.cvtColor(c, cv2.COLOR_BGR2HSV)
        hue = hsvC[0][0][0]  # Get the hue value
        
        # Handle red hue wrap-around with slightly wider tolerance for better detection
        if hue >= 165:  # Upper limit for divided red hue
            lowerLimit = np.array([hue - 15, 80, 80], dtype=np.uint8)
            upperLimit = np.array([180, 255, 255], dtype=np.uint8)
        elif hue <= 15:  # Lower limit for divided red hue
            lowerLimit = np.array([0, 80, 80], dtype=np.uint8)
            upperLimit = np.array([hue + 15, 255, 255], dtype=np.uint8)
        else:
            lowerLimit = np.array([hue - 15, 80, 80], dtype=np.uint8)
            upperLimit = np.array([hue + 15, 255, 255], dtype=np.uint8)
        
        # Cache the limits
        if cache_key not in self._hsv_cache:
            self._hsv_cache[cache_key] = {}
        self._hsv_cache[cache_key]['limits'] = (lowerLimit, upperLimit)
        
        return lowerLimit, upperLimit
    
    def predict(self, image: np.ndarray, color_hex: str = "#ff0000") -> dict:
        """
        Detect objects of specified color in the image with optimized processing.
        
        Args:
            image: Input image as numpy array (BGR format from OpenCV)
            color_hex: Hex color code to detect (e.g., "#ff0000" for red)
        
        Returns:
            dict containing detection results and annotated image
        """
        # Convert hex color to BGR
        color_bgr = self._hex_to_bgr(color_hex)
        
        # Resize image for faster processing if too large
        original_shape = image.shape
        max_dimension = 640
        scale_factor = 1.0
        
        if max(image.shape[0], image.shape[1]) > max_dimension:
            scale_factor = max_dimension / max(image.shape[0], image.shape[1])
            new_width = int(image.shape[1] * scale_factor)
            new_height = int(image.shape[0] * scale_factor)
            image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_LINEAR)
        
        # Convert image to HSV color space
        hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Get color limits
        lower_limit, upper_limit = self._get_limits(color_bgr)
        
        # Create mask - white where color is detected, black elsewhere
        mask = cv2.inRange(hsv_image, lower_limit, upper_limit)
        
        # Apply morphological operations to reduce noise (faster than complex filtering)
        kernel = np.ones((3, 3), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=1)
        
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
            cv2.rectangle(annotated_image, (x1, y1), (x2, y2), (0, 255, 0), 2)
            
            # Add label with color (smaller font for performance)
            label = f"{color_hex.upper()}"
            cv2.putText(
                annotated_image, 
                label, 
                (x1, y1 - 8), 
                cv2.FONT_HERSHEY_SIMPLEX, 
                0.5, 
                (0, 255, 0), 
                1
            )
        
        # Encode annotated image to base64 with lower quality for speed
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 75]
        _, buffer = cv2.imencode(".jpg", annotated_image, encode_param)
        annotated_encoded = base64.b64encode(buffer).decode("utf-8")
        
        # Calculate detection coverage
        total_pixels = mask.size
        detected_pixels = int(np.sum(mask > 0))
        coverage_percentage = round((detected_pixels / total_pixels) * 100, 2)
        
        # Only encode mask if specifically needed (skip for performance)
        result = {
            "detection_found": detection_found,
            "color_detected": color_hex.upper(),
            "bounding_box": bbox_coords,
            "coverage_percentage": coverage_percentage,
            "detected_pixels": detected_pixels,
            "annotated_image": annotated_encoded,
        }
        
        return result
    
    def cleanup(self):
        """Clean up resources"""
        self._hsv_cache.clear()