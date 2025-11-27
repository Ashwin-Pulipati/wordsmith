from dataclasses import dataclass
from enum import Enum
from typing import List, Optional

import anyio

from core.openai_client import openai_service
from services.text_processing import extract_keywords, build_hashtags


class TopicTooLongError(ValueError):
    """Raised when the topic exceeds the allowed length."""
    pass


class BrandVoiceProfile(str, Enum):
    NEUTRAL = "neutral"
    BOLD_MINIMALIST = "bold_minimalist"
    LUXURY_ELEGANT = "luxury_elegant"
    PLAYFUL_MODERN = "playful_modern"
    CORPORATE = "corporate"
    TECH_DATA = "tech_data_driven"
    GEN_Z = "gen_z_social"
    

@dataclass
class PromptInsight:
    message: str
    severity: str 
    suggestions: List[str]


class BrandingService:
    MAX_TOPIC_LENGTH = 100

    def __init__(self):
        self.client = openai_service
 

    def _validate_topic(self, topic: str) -> None:
        if len(topic) > self.MAX_TOPIC_LENGTH:
            raise TopicTooLongError(
                f"Topic length must not exceed {self.MAX_TOPIC_LENGTH} characters."
            )


    def _voice_instructions(self, voice: BrandVoiceProfile) -> str:
        mapping = {
            BrandVoiceProfile.NEUTRAL: (
                "a clear, modern, and professional tone suitable for a wide audience"
            ),
            BrandVoiceProfile.BOLD_MINIMALIST: (
                "a bold, punchy, minimalist tone with strong, direct language"
            ),
            BrandVoiceProfile.LUXURY_ELEGANT: (
                "an elegant, refined, premium tone that feels luxurious and aspirational"
            ),
            BrandVoiceProfile.PLAYFUL_MODERN: (
                "a playful, upbeat, conversational tone with modern phrasing"
            ),
            BrandVoiceProfile.CORPORATE: (
                "a formal, corporate, and trustworthy tone suitable for B2B clients"
            ),
            BrandVoiceProfile.TECH_DATA: (
                "a technical, data-driven tone that appeals to engineers and analysts"
            ),
            BrandVoiceProfile.GEN_Z: (
                "a casual, Gen-Z social-media tone that feels friendly and current"
            ),
        }
        return mapping.get(voice, mapping[BrandVoiceProfile.NEUTRAL])
    

    async def generate_branding_lines(
        self, topic: str, voice: BrandVoiceProfile
    ) -> str:
        self._validate_topic(topic)

        style = self._voice_instructions(voice)
        prompt = (
            f"Act as a professional brand copywriter for a modern {topic} company. "
            f"Write exactly 3 short branding lines in {style}. "
            "Each line must:\n"
            "- Sound like a natural marketing tagline or sentence.\n"
            "- Be warm, clear, trustworthy, and polished.\n"
            "- Be concise (20–30 words max).\n"
            "- Use only standard hyphens (-). Do not use en dashes (–), "
            "em dashes (—), —, or double dashes (--) at any cost.\n"
            "Return only the 3 lines, each on its own line, with no numbering, "
            "quotes, or extra commentary."
        )

        return await anyio.to_thread.run_sync(self.client.run_wordsmith, prompt)

    async def generate_keywords(
        self, topic: str, voice: BrandVoiceProfile
    ) -> List[str]:
        self._validate_topic(topic)

        style = self._voice_instructions(voice)
        prompt = (
            f"Generate 10 short branding keywords for a {topic} company, "
            f"aligned with {style}. "
            "Return them as a single comma-separated list with no numbering, "
            "bullets, or extra text."
        )

        raw_text = await anyio.to_thread.run_sync(self.client.run_wordsmith, prompt)
        return extract_keywords(raw_text)

    def generate_hashtags(self, keywords: List[str]) -> List[str]:
        return build_hashtags(keywords)

    async def analyze_prompt(self, topic: str) -> Optional[PromptInsight]:
        """
        Lightweight 'prompt intelligence' using heuristics only
        (no extra OpenAI call) to keep cost + latency low.
        """
        cleaned = topic.strip().lower()
        if not cleaned:
            return None

        generic_terms = {
            "business",
            "store",
            "company",
            "brand",
            "products",
            "services",
            "clothes",
            "clothing",
            "coffee",
            "food",
            "fitness",
        }

        words = cleaned.split()
        suggestions: List[str] = []
        message: Optional[str] = None
        severity = "info"
        
        if len(words) == 1 or cleaned in generic_terms:
            severity = "warning"
            message = (
                "Your topic looks quite broad. "
                "More specific topics usually produce stronger, more targeted branding."
            )
            
        elif len(words) <= 3:
            message = (
                "You might get better results by adding a bit more detail "
                "(audience, niche, or value prop)."
            )
       
        if "coffee" in cleaned:
            suggestions = [
                "specialty coffee roastery",
                "third-wave coffee subscription",
            ]
        elif "clothing" in cleaned or "clothes" in cleaned:
            suggestions = [
                "sustainable athleisure brand",
                "minimalist streetwear label",
            ]
        elif "fitness" in cleaned:
            suggestions = [
                "online fitness coaching for busy professionals",
                "strength training app for beginners",
            ]
        elif not suggestions and message:
            suggestions = [
                f"premium {cleaned} for a specific audience",
                f"{cleaned} brand with a clear niche or story",
            ]

        if not message:
            return None

        return PromptInsight(
            message=message,
            severity=severity,
            suggestions=suggestions,
        )