from fastapi import APIRouter
from triage.models import TriageRequest, TriageResponse
from triage.service import analyze_complaint
from rag.service import answer_question

from pydantic import BaseModel


class KnowledgeQuery(BaseModel):
    question: str

router = APIRouter()


@router.post("/triage", response_model=TriageResponse)
def triage(request: TriageRequest):
    return analyze_complaint(request)
@router.post("/knowledge/query")
def knowledge_query(request: KnowledgeQuery):
    return answer_question(request.question)