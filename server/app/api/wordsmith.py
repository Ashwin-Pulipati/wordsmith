from fastapi import APIRouter
from app.core.openai_client import openai_service

router = APIRouter()

@router.get("/wordsmith")
def get_story():
    
    output = openai_service.run_wordsmith(
        "Write a one-sentence bedtime story about a unicorn."
    )
    return {"output": output}
