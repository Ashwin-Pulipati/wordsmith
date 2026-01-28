from fastapi import FastAPI
from mangum import Mangum

from api.wordsmith import router as wordsmith_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(wordsmith_router)

@app.get("/")
def root():
    return {"status": "ok", "message": "Wordsmith API is running"}

origins = ['http://localhost:3000']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

handler = Mangum(app)