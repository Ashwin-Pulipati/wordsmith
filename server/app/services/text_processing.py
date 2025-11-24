import re
from typing import List

def extract_keywords(text: str) -> List[str]:
    """
    Convert a comma/space-separated keyword string into a clean list.

    - Splits on commas, semicolons, or whitespace.
    - Removes leading/trailing punctuation.
    - Lowercases all terms.
    - Filters out empty values.
    """
    raw_parts = re.split(r"[,\s;]+", text.strip())

    cleaned = []
    for part in raw_parts:
        token = re.sub(r"^[^\w]+|[^\w]+$", "", part)
        if token:
            cleaned.append(token.lower())

    return cleaned
