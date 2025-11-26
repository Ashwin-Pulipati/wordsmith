# app/main.py
from fastapi import FastAPI
from mangum import Mangum

from api.wordsmith import router as wordsmith_router

app = FastAPI()

app.include_router(wordsmith_router)

# This is what Lambda will call
handler = Mangum(app)
