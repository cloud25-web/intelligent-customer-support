from pydantic import BaseModel
from typing import List, Optional


class TriageRequest(BaseModel):
    complaint: str


class TriageResponse(BaseModel):
    intent: str
    category: str
    sentiment: str
    urgency: str
    missing_information: List[str]
    confidence: float
    requires_question: bool
    next_question: Optional[str]
    recommended_action: str