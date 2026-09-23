package com.intelligentcustomersupport.Backend.Controller;

import com.intelligentcustomersupport.Backend.Entity.Escalation;
import com.intelligentcustomersupport.Backend.Service.EscalationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/escalations")
public class EscalationController {

    private final EscalationService escalationService;

    public EscalationController(EscalationService escalationService) {
        this.escalationService = escalationService;
    }

    @PostMapping("/evaluate")
    public Escalation evaluateEscalation(
            @RequestParam Long ticketId,
            @RequestParam String severity,
            @RequestParam String urgency,
            @RequestParam double confidence,
            @RequestParam(required = false) String riskSignals) {

        return escalationService.evaluateEscalation(
                ticketId,
                severity,
                urgency,
                confidence,
                riskSignals
        );
    }

    @GetMapping
    public List<Escalation> getAllEscalations() {
        return escalationService.getAllEscalations();
    }

    @GetMapping("/ticket/{ticketId}")
    public List<Escalation> getByTicket(@PathVariable Long ticketId) {
        return escalationService.getEscalationsByTicket(ticketId);
    }
}
