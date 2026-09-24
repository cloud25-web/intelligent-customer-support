package com.intelligentcustomersupport.Backend.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Column;

import java.time.LocalDateTime;

@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String customerId;
    private String message;
    private String status = "OPEN";

    @Enumerated(EnumType.STRING)
    private Department department;

    private LocalDateTime createdAt;

    // AI Triage data
    private String aiIntent;
    private String aiCategory;
    private String aiSentiment;
    private String aiUrgency;

    @Column(length = 2000)
    private String aiMissingInformation;

    private double aiConfidence;
    private boolean aiRequiresQuestion;

    @Column(length = 2000)
    private String aiNextQuestion;

    private String aiRecommendedAction;
    private String aiRiskLevel;

    // Knowledge / RAG data
    @Column(length = 3000)
    private String knowledgeAnswer;

    @Column(length = 2000)
    private String knowledgeSources;

    private boolean requiresEscalation;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getAiIntent() {
        return aiIntent;
    }

    public void setAiIntent(String aiIntent) {
        this.aiIntent = aiIntent;
    }

    public String getAiCategory() {
        return aiCategory;
    }

    public void setAiCategory(String aiCategory) {
        this.aiCategory = aiCategory;
    }

    public String getAiSentiment() {
        return aiSentiment;
    }

    public void setAiSentiment(String aiSentiment) {
        this.aiSentiment = aiSentiment;
    }

    public String getAiUrgency() {
        return aiUrgency;
    }

    public void setAiUrgency(String aiUrgency) {
        this.aiUrgency = aiUrgency;
    }

    public String getAiMissingInformation() {
        return aiMissingInformation;
    }

    public void setAiMissingInformation(String aiMissingInformation) {
        this.aiMissingInformation = aiMissingInformation;
    }

    public double getAiConfidence() {
        return aiConfidence;
    }

    public void setAiConfidence(double aiConfidence) {
        this.aiConfidence = aiConfidence;
    }

    public boolean isAiRequiresQuestion() {
        return aiRequiresQuestion;
    }

    public void setAiRequiresQuestion(boolean aiRequiresQuestion) {
        this.aiRequiresQuestion = aiRequiresQuestion;
    }

    public String getAiNextQuestion() {
        return aiNextQuestion;
    }

    public void setAiNextQuestion(String aiNextQuestion) {
        this.aiNextQuestion = aiNextQuestion;
    }

    public String getAiRecommendedAction() {
        return aiRecommendedAction;
    }

    public void setAiRecommendedAction(String aiRecommendedAction) {
        this.aiRecommendedAction = aiRecommendedAction;
    }

    public String getAiRiskLevel() {
        return aiRiskLevel;
    }

    public void setAiRiskLevel(String aiRiskLevel) {
        this.aiRiskLevel = aiRiskLevel;
    }

    public String getKnowledgeAnswer() {
        return knowledgeAnswer;
    }

    public void setKnowledgeAnswer(String knowledgeAnswer) {
        this.knowledgeAnswer = knowledgeAnswer;
    }

    public String getKnowledgeSources() {
        return knowledgeSources;
    }

    public void setKnowledgeSources(String knowledgeSources) {
        this.knowledgeSources = knowledgeSources;
    }

    public boolean isRequiresEscalation() {
        return requiresEscalation;
    }

    public void setRequiresEscalation(boolean requiresEscalation) {
        this.requiresEscalation = requiresEscalation;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
