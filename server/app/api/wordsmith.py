import asyncio

from fastapi import APIRouter, HTTPException

from app.services.branding_service import BrandingService, TopicTooLongError

router = APIRouter()
branding_service = BrandingService()


@router.get("/wordsmith")
async def generate_branding_content(topic: str = "hospital"):
    try:
        branding_output, keywords = await asyncio.gather(
            branding_service.generate_branding_lines(topic),
            branding_service.generate_keywords(topic),
        )

    except TopicTooLongError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return {
        "branding_text_result": branding_output,
        "keywords": keywords,
    }
