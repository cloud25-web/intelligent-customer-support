package com.intelligentcustomersupport.Backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class TriageResponse {

    private String intent;
    private String category;
    private String sentiment;
    private String urgency;

    @JsonProperty("missing_information")
    private List<String> missingInformation;

    private double confidence;

    @JsonProperty("requires_question")
    private boolean requiresQuestion;

    @JsonProperty("next_question")
    private String nextQuestion;

    @JsonProperty("recommended_action")
    private String recommendedAction;

    @JsonProperty("risk_level")
    private String riskLevel;

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSentiment() {
        return sentiment;
    }

    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public List<String> getMissingInformation() {
        return missingInformation;
    }

    public void setMissingInformation(List<String> missingInformation) {
        this.missingInformation = missingInformation;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public boolean isRequiresQuestion() {
        return requiresQuestion;
    }

    public void setRequiresQuestion(boolean requiresQuestion) {
        this.requiresQuestion = requiresQuestion;
    }

    public String getNextQuestion() {
        return nextQuestion;
    }

    public void setNextQuestion(String nextQuestion) {
        this.nextQuestion = nextQuestion;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}