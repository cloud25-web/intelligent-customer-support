package com.intelligentcustomersupport.Backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class TriageRequest {

    private String complaint;

    @JsonProperty("conversation_history")
    private List<String> conversationHistory;

    public String getComplaint() {
        return complaint;
    }

    public void setComplaint(String complaint) {
        this.complaint = complaint;
    }

    public List<String> getConversationHistory() {
        return conversationHistory;
    }

    public void setConversationHistory(List<String> conversationHistory) {
        this.conversationHistory = conversationHistory;
    }
}