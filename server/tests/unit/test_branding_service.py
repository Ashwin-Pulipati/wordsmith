import pytest
from unittest.mock import MagicMock, patch
from services.branding_service import BrandingService, BrandVoiceProfile, TopicTooLongError

@pytest.fixture
def branding_service():
    # Patch openai_service before initializing BrandingService
    with patch('services.branding_service.openai_service') as mock_openai:
        service = BrandingService()
        yield service, mock_openai

def test_validate_topic_valid(branding_service):
    service, _ = branding_service
    # Should not raise
    service._validate_topic("Valid topic")

def test_validate_topic_invalid(branding_service):
    service, _ = branding_service
    with pytest.raises(TopicTooLongError):
        service._validate_topic("a" * 101)

@pytest.mark.asyncio
async def test_generate_branding_lines(branding_service):
    service, mock_openai = branding_service
    mock_openai.run_wordsmith.return_value = "Line 1\nLine 2\nLine 3"
    
    result = await service.generate_branding_lines("coffee", BrandVoiceProfile.NEUTRAL)
    
    assert result == "Line 1\nLine 2\nLine 3"
    mock_openai.run_wordsmith.assert_called_once()

@pytest.mark.asyncio
async def test_analyze_prompt_broad(branding_service):
    service, _ = branding_service
    insight = await service.analyze_prompt("coffee")
    
    assert insight is not None
    assert insight.severity == "warning"
    assert "broad" in insight.message.lower()

@pytest.mark.asyncio
async def test_analyze_prompt_specific(branding_service):
    service, _ = branding_service
    # "specialty coffee roastery for busy urbanites" is specific
    insight = await service.analyze_prompt("specialty coffee roastery for busy urbanites")
    
    # It might still return info if it's not "broad" but "could be better"
    # Looking at logic: elif len(words) <= 3: message = ...
    # This has 6 words. It might return None.
    assert insight is None
