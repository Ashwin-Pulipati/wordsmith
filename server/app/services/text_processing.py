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
