import base64
import cv2
import numpy as np
from app.ml.base import BaseCVModel
from PIL import Image


class ColorDetectorModel(BaseCVModel):
    def __init__(self):
        self._cache = {}

    def load(self):
        """No weights required"""
        pass

    def _hex_to_bgr(self, hex_color: str) -> tuple:
        hex_color = hex_color.lstrip("#")

        if hex_color in self._cache:
            return self._cache[hex_color]["bgr"]

        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)

        bgr = (b, g, r)
        self._cache[hex_color] = {"bgr": bgr}
        return bgr

    def _get_hsv_ranges(self, color_bgr: tuple):
        c = np.uint8([[color_bgr]])
        hsv = cv2.cvtColor(c, cv2.COLOR_BGR2HSV)
        hue = int(hsv[0][0][0])

        # Red color → split range
        if hue < 10 or hue > 170:
            return [
                (np.array([0, 70, 70]), np.array([10, 255, 255])),
                (np.array([170, 70, 70]), np.array([180, 255, 255])),
            ]

        lower = np.array([max(hue - 12, 0), 70, 70])
        upper = np.array([min(hue + 12, 180), 255, 255])
        return [(lower, upper)]

    def predict(self, image: np.ndarray, color_hex: str = "#ff0000") -> dict:
        color_bgr = self._hex_to_bgr(color_hex)

        # Resize for speed
        max_dim = 640
        scale = 1.0
        h, w = image.shape[:2]
        if max(h, w) > max_dim:
            scale = max_dim / max(h, w)
            image = cv2.resize(
                image,
                (int(w * scale), int(h * scale)),
                interpolation=cv2.INTER_LINEAR,
            )

        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

        # Create mask (handle multi-range colors)
        mask = np.zeros(hsv.shape[:2], dtype=np.uint8)
        for lower, upper in self._get_hsv_ranges(color_bgr):
            mask |= cv2.inRange(hsv, lower, upper)

        # Morphology cleanup
        kernel = np.ones((5, 5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

        # Find contours
        contours, _ = cv2.findContours(
            mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )

        annotated = image.copy()
        detection_found = False
        bbox_coords = None

        if contours:
            largest = max(contours, key=cv2.contourArea)
            area = cv2.contourArea(largest)

            # Ignore tiny detections
            if area > 500:
                x, y, w_box, h_box = cv2.boundingRect(largest)
                detection_found = True
                bbox_coords = {
                    "x1": int(x),
                    "y1": int(y),
                    "x2": int(x + w_box),
                    "y2": int(y + h_box),
                }

                cv2.rectangle(
                    annotated,
                    (x, y),
                    (x + w_box, y + h_box),
                    (0, 255, 0),
                    2,
                )

                cv2.putText(
                    annotated,
                    color_hex.upper(),
                    (x, y - 8),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 0),
                    1,
                )

        # Encode annotated image
        _, buffer = cv2.imencode(
            ".jpg", annotated, [int(cv2.IMWRITE_JPEG_QUALITY), 75]
        )
        annotated_encoded = base64.b64encode(buffer).decode("utf-8")

        detected_pixels = int(np.count_nonzero(mask))
        coverage = round((detected_pixels / mask.size) * 100, 2)

        return {
            "detection_found": detection_found,
            "color_detected": color_hex.upper(),
            "bounding_box": bbox_coords,
            "coverage_percentage": coverage,
            "detected_pixels": detected_pixels,
            "annotated_image": annotated_encoded,
        }

    def cleanup(self):
        self._cache.clear()
