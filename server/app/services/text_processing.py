import csv
import io
import string
from typing import List

PUNCTUATION = string.punctuation


def extract_keywords(text: str) -> List[str]:
    """
    Convert a comma-separated keyword string into a clean list.

    - Uses csv.reader to handle commas robustly.
    - Strips whitespace and surrounding punctuation.
    - Lowercases all terms.
    - Filters out empty values.
    """
    reader = csv.reader(io.StringIO(text))
    row = next(reader, [])

    keywords: List[str] = []
    for cell in row:
        token = cell.strip().strip(PUNCTUATION).lower()
        if token:
            keywords.append(token)

    return keywords


def build_hashtags(keywords: List[str]) -> List[str]:
    """
    Turn keywords into simple social-ready hashtags.

    - Removes internal spaces.
    - Keeps only basic word characters and '#'.
    - Deduplicates while preserving order.
    """
    seen = set()
    hashtags: List[str] = []

    for kw in keywords:
        base = "".join(ch for ch in kw if ch.isalnum() or ch == " ")
        base = base.replace(" ", "")
        if not base:
            continue
        tag = f"#{base}"
        if tag not in seen:
            seen.add(tag)
            hashtags.append(tag)

    return hashtags
