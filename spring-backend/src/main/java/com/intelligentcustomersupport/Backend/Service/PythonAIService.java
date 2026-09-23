package com.intelligentcustomersupport.Backend.Service;

import com.intelligentcustomersupport.Backend.DTO.TriageRequest;
import com.intelligentcustomersupport.Backend.DTO.TriageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.intelligentcustomersupport.Backend.DTO.KnowledgeRequest;
import com.intelligentcustomersupport.Backend.DTO.KnowledgeResponse;

@Service
public class PythonAIService {

    private final RestClient restClient;

    public PythonAIService(@Value("${python.ai.base-url}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public TriageResponse triage(TriageRequest request) {
        return restClient.post()
                .uri("/triage")
                .body(request)
                .retrieve()
                .body(TriageResponse.class);
    }

    public KnowledgeResponse queryKnowledge(KnowledgeRequest request) {
        return restClient.post()
                .uri("/knowledge/query")
                .body(request)
                .retrieve()
                .body(KnowledgeResponse.class);
    }
}