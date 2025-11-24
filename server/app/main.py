from fastapi import FastAPI
from app.api.wordsmith import router as wordsmith_router

app = FastAPI()
app.include_router(wordsmith_router)
