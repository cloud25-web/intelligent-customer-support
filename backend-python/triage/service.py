import os
import json
from groq import Groq
from dotenv import load_dotenv

from .models import TriageRequest, TriageResponse

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def analyze_complaint(request: TriageRequest) -> TriageResponse:

    prompt = f"""
You are an AI customer support triage system.

Analyze the following customer complaint.

Complaint:
{request.complaint}

Determine:

1. intent
2. category
3. sentiment
4. urgency
5. missing information
6. confidence
7. whether a question is required
8. the next question if information is missing
9. recommended action

Allowed categories:
- payment_issue
- refund_issue
- order_delivery
- technical_issue
- account_issue

Allowed sentiment:
- positive
- neutral
- frustrated
- angry

Allowed urgency:
- low
- medium
- high
- critical

Allowed recommended actions:
- resolve
- ask_question
- escalate

Return ONLY valid JSON in this exact format:

{{
    "intent": "string",
    "category": "string",
    "sentiment": "string",
    "urgency": "string",
    "missing_information": [],
    "confidence": 0.0,
    "requires_question": false,
    "next_question": null,
    "recommended_action": "string"
}}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    result = json.loads(response.choices[0].message.content)

    return TriageResponse(**result)