from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import models

app = FastAPI(title = "ML_HUB")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(models.router)

@app.get("/")
def root():
    return { "status": "FastAPI running" }
    
@app.get("/health")
def health():
    return { "status": "ok" }