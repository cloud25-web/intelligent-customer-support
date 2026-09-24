package com.intelligentcustomersupport.Backend.Service;

import com.intelligentcustomersupport.Backend.Entity.Escalation;
import com.intelligentcustomersupport.Backend.Entity.Ticket;
import com.intelligentcustomersupport.Backend.Repository.EscalationRepository;
import com.intelligentcustomersupport.Backend.Repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EscalationService {

    private final EscalationRepository escalationRepository;
    private final TicketRepository ticketRepository;

    public EscalationService(
            EscalationRepository escalationRepository,
            TicketRepository ticketRepository) {

        this.escalationRepository = escalationRepository;
        this.ticketRepository = ticketRepository;
    }

    public Escalation evaluateEscalation(
            Long ticketId,
            String severity,
            String urgency,
            double confidence,
            String riskSignals) {

        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);

        if (ticket == null) {
            throw new IllegalArgumentException("Ticket not found");
        }

        boolean shouldEscalate =
                severity.equalsIgnoreCase("HIGH")
                || severity.equalsIgnoreCase("CRITICAL")
                || urgency.equalsIgnoreCase("IMMEDIATE")
                || confidence < 0.60
                || (riskSignals != null &&
                    riskSignals.toLowerCase().contains("financial"));

        Escalation escalation = new Escalation();

        escalation.setTicketId(ticketId);
        escalation.setEscalationRequired(shouldEscalate);
        escalation.setCreatedAt(LocalDateTime.now());

        if (shouldEscalate) {

            escalation.setPriority(
                    severity.equalsIgnoreCase("CRITICAL")
                            ? "CRITICAL"
                            : "HIGH"
            );

            escalation.setAssignedTeam(ticket.getDepartment().name());

            escalation.setAssignedAgent(
                    ticket.getDepartment().name() + "-AGENT-01"
            );

            escalation.setRiskSignals(riskSignals);

            escalation.setReason(
                    buildReason(severity, urgency, confidence, riskSignals)
            );

            escalation.setContextSummary(
                    "Customer ID: " + ticket.getCustomerId()
                    + " | Complaint: " + ticket.getMessage()
                    + " | Department: " + ticket.getDepartment()
                    + " | Severity: " + severity
                    + " | Urgency: " + urgency
                    + " | AI Confidence: " + confidence
                    + " | Risk: " + riskSignals
            );

            ticket.setStatus("ESCALATED");
            ticketRepository.save(ticket);

        } else {

            escalation.setPriority("NORMAL");
            escalation.setAssignedTeam(ticket.getDepartment().name());
            escalation.setRiskSignals("LOW");
            escalation.setReason("Issue can be handled without human escalation.");
            escalation.setContextSummary(
                    "Ticket does not currently meet escalation criteria."
            );
        }

        return escalationRepository.save(escalation);
    }

    private String buildReason(
            String severity,
            String urgency,
            double confidence,
            String riskSignals) {

        StringBuilder reason = new StringBuilder();

        if (severity.equalsIgnoreCase("HIGH")
                || severity.equalsIgnoreCase("CRITICAL")) {
            reason.append("High severity. ");
        }

        if (urgency.equalsIgnoreCase("IMMEDIATE")) {
            reason.append("Immediate attention required. ");
        }

        if (confidence < 0.60) {
            reason.append("AI resolution confidence is low. ");
        }

        if (riskSignals != null &&
                riskSignals.toLowerCase().contains("financial")) {
            reason.append("Financial risk detected. ");
        }

        return reason.toString().trim();
    }

    public List<Escalation> getAllEscalations() {
        return escalationRepository.findAll();
    }

    public List<Escalation> getEscalationsByTicket(Long ticketId) {
        return escalationRepository.findByTicketId(ticketId);
    }
}
