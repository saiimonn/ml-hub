import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routes import models

load_dotenv()

app = FastAPI(title="ML_HUB")

allowed_origins_env = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000"
)

allowed_origins = [
    origin.strip()
    for origin in allowed_origins_env.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(models.router)

@app.get("/")
def root():
    return {"status": "FastAPI running"}

@app.api_route("/health", methods=["GET", "HEAD"])
def health(request: Request):
    return {"status": "ok"}