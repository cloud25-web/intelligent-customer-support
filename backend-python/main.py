from fastapi import FastAPI
from api.routes import router

app = FastAPI(
    title="Intelligent Customer Support - AI Service",
    version="0.1.0"
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "AI Support Service is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }