from typing import List

import anyio

from app.core.openai_client import openai_service
from app.services.text_processing import extract_keywords


class TopicTooLongError(ValueError):
    """Raised when the topic exceeds the allowed length."""
    pass


class BrandingService:
    MAX_TOPIC_LENGTH = 32

    def __init__(self):
        self.client = openai_service

    def _validate_topic(self, topic: str) -> None:
        if len(topic) > self.MAX_TOPIC_LENGTH:
            raise TopicTooLongError(
                f"Topic length must not exceed {self.MAX_TOPIC_LENGTH} characters."
            )

    async def generate_branding_lines(self, topic: str) -> str:
        self._validate_topic(topic)

        prompt = (
            f"Act as a professional brand copywriter for a modern {topic} company. "
            f"Write exactly 3 short branding lines that reflect {topic}-focused services. "
            "Each line must:\n"
            "- Sound like a natural marketing tagline or sentence.\n"
            "- Feel warm, clear, trustworthy, and polished.\n"
            "- Be concise (20–30 words max).\n"
            "- Use only standard hyphens (-). Do not use en dashes (–), "
            "em dashes (—), or double dashes (--).\n"
            "Return only the 3 lines, each on its own line, with no numbering, "
            "quotes, or extra commentary."
        )

        # run_wordsmith is sync → offload to a thread
        return await anyio.to_thread.run_sync(self.client.run_wordsmith, prompt)

    async def generate_keywords(self, topic: str) -> List[str]:
        self._validate_topic(topic)

        prompt = (
            f"Generate 10 short branding keywords related to '{topic}'. "
            "Return them as a single comma-separated list with no numbering, "
            "bullets, or extra text."
        )

        raw_text = await anyio.to_thread.run_sync(self.client.run_wordsmith, prompt)
        return extract_keywords(raw_text)
