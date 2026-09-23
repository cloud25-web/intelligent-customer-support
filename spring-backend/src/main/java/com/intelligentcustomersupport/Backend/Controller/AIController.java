package com.intelligentcustomersupport.Backend.Controller;

import com.intelligentcustomersupport.Backend.DTO.KnowledgeRequest;
import com.intelligentcustomersupport.Backend.DTO.KnowledgeResponse;
import com.intelligentcustomersupport.Backend.DTO.TriageRequest;
import com.intelligentcustomersupport.Backend.DTO.TriageResponse;
import com.intelligentcustomersupport.Backend.Service.PythonAIService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final PythonAIService pythonAIService;

    public AIController(PythonAIService pythonAIService) {
        this.pythonAIService = pythonAIService;
    }

    @PostMapping("/triage")
    public TriageResponse triage(@RequestBody TriageRequest request) {
        return pythonAIService.triage(request);
    }

    @PostMapping("/knowledge")
    public KnowledgeResponse knowledge(
            @RequestBody KnowledgeRequest request) {

        return pythonAIService.queryKnowledge(request);
    }
}