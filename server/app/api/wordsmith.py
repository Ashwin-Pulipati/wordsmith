# api/wordsmith.py
import asyncio

from fastapi import APIRouter, HTTPException, Query

from services.branding_service import (
    BrandingService,
    TopicTooLongError,
    BrandVoiceProfile,
)

router = APIRouter()
branding_service = BrandingService()


@router.get("/wordsmith")
async def generate_branding_content(
    topic: str = Query(
        "real estate",
        max_length=100,
        description=(
            "Branding topic (e.g., 'real estate', 'fitness coaching'). "
            "Max length 100 characters."
        ),
    ),
    voice: BrandVoiceProfile = Query(
        BrandVoiceProfile.NEUTRAL,
        description="Optional brand voice profile.",
    ),
):
    try:
        branding_output, keywords, prompt_insight = await asyncio.gather(
            branding_service.generate_branding_lines(topic, voice),
            branding_service.generate_keywords(topic, voice),
            branding_service.analyze_prompt(topic),
        )
    except TopicTooLongError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    hashtags = branding_service.generate_hashtags(keywords)

    return {
        "branding_text_result": branding_output,
        "keywords": keywords,
        "hashtags": hashtags,
        "voice_profile": voice.value,
        "prompt_insights": (
            {
                "message": prompt_insight.message,
                "severity": prompt_insight.severity,
                "suggestions": prompt_insight.suggestions,
            }
            if prompt_insight
            else None
        ),
    }
