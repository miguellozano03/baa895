import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import forecast, metrics

app = FastAPI(title="UK Wind Forecast Accuracy")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(forecast.router)
app.include_router(metrics.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}