from fastapi import APIRouter
from app.services.branding_service import BrandingService

router = APIRouter()
branding_service = BrandingService()


@router.get("/wordsmith")
def generate_branding_content():
    topic = "real estate"

    branding_snippet = branding_service.generate_branding_lines(topic)
    keywords = branding_service.generate_keywords(topic)

    return {
        "branding_text_result": branding_snippet,
        "keywords": keywords,
    }
