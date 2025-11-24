from fastapi import APIRouter, HTTPException
from app.services.branding_service import BrandingService, TopicTooLongError

router = APIRouter()
branding_service = BrandingService()


@router.get("/wordsmith")
def generate_branding_content(topic: str = "e-commerce"):
    try:
        branding_snippet = branding_service.generate_branding_lines(topic)
        keywords = branding_service.generate_keywords(topic)

    except TopicTooLongError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "branding_text_result": branding_snippet,
        "keywords": keywords,
    }
