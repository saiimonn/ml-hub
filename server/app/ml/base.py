from abc import ABC, abstractmethod
import numpy as np

class BaseCVModel(ABC):
    @abstractmethod
    def load(self):
        pass
        
    @abstractmethod
    def predict(self, image: np.ndarray) -> dict:
        pass
    
    @abstractmethod
    def cleanup(self):
        pass