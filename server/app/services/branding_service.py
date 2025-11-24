from app.core.openai_client import openai_service
from app.services.text_processing import extract_keywords


class TopicTooLongError(ValueError):
    pass


class BrandingService:
    MAX_TOPIC_LENGTH = 32

    def __init__(self):
        self.client = openai_service

    def _validate_topic(self, topic: str):
        if len(topic) > self.MAX_TOPIC_LENGTH:
            raise TopicTooLongError(
                f"Topic length must not exceed {self.MAX_TOPIC_LENGTH} characters."
            )

    def generate_branding_lines(self, topic: str) -> str:
        self._validate_topic(topic)

        prompt = (
            f"Act as a professional brand copywriter for a modern {topic} company. "
            f"Write exactly 3 short branding lines that reflect {topic} services. "
            "Each line must:\n"
            "- Sound like a natural marketing tagline or sentence.\n"
            "- Feel warm, clear, trustworthy, and polished.\n"
            "- Be concise (20–30 words max).\n"
            "- Use only standard hyphens (-). No en dashes (–), em dashes (—), or double dashes (--).\n"
            "Return only the 3 lines, each on its own line, with no numbering or extra text."
        )
        return self.client.run_wordsmith(prompt)

    def generate_keywords(self, topic: str) -> list[str]:
        self._validate_topic(topic)

        prompt = (
            f"Generate 10 short branding keywords related to '{topic}'. "
            "Return them as a comma-separated list with no extra text."
        )

        text = self.client.run_wordsmith(prompt)
        return extract_keywords(text)
