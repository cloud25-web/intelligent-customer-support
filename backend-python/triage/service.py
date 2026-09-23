import os
import json
from groq import Groq
from dotenv import load_dotenv
from .models import TriageRequest, TriageResponse
from .rules import apply_escalation_rules


load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def analyze_complaint(request: TriageRequest) -> TriageResponse:

    prompt = f"""
You are an AI customer support triage system.

Analyze the following customer complaint.

Complaint:
{request.complaint}

Previous conversation:
{request.conversation_history}

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
    "recommended_action": "string",
    "risk_level": "string"
}}
Determine whether enough information is available to understand and handle the complaint.

If important information is missing:
- Add the missing information to missing_information.
- Set requires_question to true.
- Generate one clear next_question asking for the most important missing information.
- Set recommended_action to "ask_question".

If enough information is available:
- Set missing_information to an empty list.
- Set requires_question to false.
- Set next_question to null.
- Choose either "resolve" or "escalate" as the recommended action.

Do not ask for information that is already present in the complaint or conversation history.
Ask only ONE question at a time.

Determine the risk level of the complaint.

Allowed risk levels:
- low
- medium
- high
- critical

Risk should consider:
- potential financial loss
- account/security problems
- repeated unresolved complaints
- serious service disruption
- critical or time-sensitive situations
- uncertainty in the AI's understanding

Return the risk level in the JSON response.
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
    triage_result = TriageResponse(**result)
    return apply_escalation_rules(triage_result)