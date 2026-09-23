def apply_escalation_rules(result):
    """
    Applies deterministic rules after AI analysis.
    """

    # Critical risk always requires human intervention
    if result.risk_level == "critical":
        result.recommended_action = "escalate"
        result.requires_question = False
        result.next_question = None
        return result

    # Critical urgency + high risk
    if (
        result.urgency == "critical"
        and result.risk_level == "high"
    ):
        result.recommended_action = "escalate"
        result.requires_question = False
        result.next_question = None
        return result

    # Low AI confidence
    if result.confidence < 0.60:
        result.recommended_action = "escalate"
        result.requires_question = False
        result.next_question = None
        return result

    # Missing information
    if result.missing_information:
        result.recommended_action = "ask_question"
        result.requires_question = True
        return result

    # Otherwise keep AI recommendation
    return result