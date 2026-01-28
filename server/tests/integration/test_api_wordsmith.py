import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app

client = TestClient(app)

@pytest.fixture
def mock_openai():
    with patch('api.wordsmith.branding_service.client') as mock:
        yield mock

def test_wordsmith_endpoint_success(mock_openai):
    mock_openai.run_wordsmith.side_effect = [
        "Line 1\nLine 2\nLine 3", # for generate_branding_lines
        "keyword1, keyword2, keyword3" # for generate_keywords
    ]
    
    response = client.get("/wordsmith", params={"topic": "coffee", "voice": "neutral"})
    
    assert response.status_code == 200
    data = response.json()
    assert "branding_text_result" in data
    assert data["keywords"] == ["keyword1", "keyword2", "keyword3"]
    assert data["hashtags"] == ["#keyword1", "#keyword2", "#keyword3"]
    assert data["voice_profile"] == "neutral"

def test_wordsmith_endpoint_topic_too_long():
    # FastAPI Query(max_length=100) will handle this, 
    # but let's see if our service's 100 char limit also triggers 400.
    response = client.get("/wordsmith", params={"topic": "a" * 101})
    
    # FastAPI returns 422 Unprocessable Entity for Query(max_length) validation
    # Our TopicTooLongError returns 400.
    # Since Query(max_length=100) is checked first by FastAPI, it should be 422.
    assert response.status_code == 422

def test_wordsmith_endpoint_invalid_voice():
    response = client.get("/wordsmith", params={"topic": "coffee", "voice": "invalid_voice"})
    assert response.status_code == 422
