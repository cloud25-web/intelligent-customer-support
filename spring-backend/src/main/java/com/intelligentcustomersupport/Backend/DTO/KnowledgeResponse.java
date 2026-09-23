package com.intelligentcustomersupport.Backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class KnowledgeResponse {

    private String answer;
    private List<String> sources;
    private double confidence;

    @JsonProperty("requires_escalation")
    private boolean requiresEscalation;

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public List<String> getSources() {
        return sources;
    }

    public void setSources(List<String> sources) {
        this.sources = sources;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public boolean isRequiresEscalation() {
        return requiresEscalation;
    }

    public void setRequiresEscalation(boolean requiresEscalation) {
        this.requiresEscalation = requiresEscalation;
    }
}