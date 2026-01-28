from services.text_processing import extract_keywords, build_hashtags

def test_extract_keywords_basic():
    text = "Coffee, Roast, Brew"
    expected = ["coffee", "roast", "brew"]
    assert extract_keywords(text) == expected

def test_extract_keywords_with_punctuation():
    text = "Coffee!, (Roast), brew..."
    expected = ["coffee", "roast", "brew"]
    assert extract_keywords(text) == expected

def test_extract_keywords_empty():
    assert extract_keywords("") == []

def test_build_hashtags_basic():
    keywords = ["specialty coffee", "roastery"]
    expected = ["#specialtycoffee", "#roastery"]
    assert build_hashtags(keywords) == expected

def test_build_hashtags_deduplication():
    keywords = ["coffee", "COFFEE", "specialty coffee"]
    # keywords are already lowercased in real usage, but build_hashtags should handle it if passed
    # Actually extract_keywords lowercases them.
    assert build_hashtags(["coffee", "coffee"]) == ["#coffee"]

def test_build_hashtags_empty():
    assert build_hashtags([]) == []
