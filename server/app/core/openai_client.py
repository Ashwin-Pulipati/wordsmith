from openai import OpenAI
from core.config import settings

class OpenAIService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def run_wordsmith(self, prompt: str):
        response = self.client.responses.create(
            model="gpt-4o-mini",
            input=prompt
        )
        return response.output_text

openai_service = OpenAIService()
