from fastapi import APIRouter
from triage.models import TriageRequest, TriageResponse
from triage.service import analyze_complaint

router = APIRouter()


@router.post("/triage", response_model=TriageResponse)
def triage(request: TriageRequest):
    return analyze_complaint(request)