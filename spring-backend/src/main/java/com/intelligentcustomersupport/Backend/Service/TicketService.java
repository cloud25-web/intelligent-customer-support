package com.intelligentcustomersupport.Backend.Service;

import com.intelligentcustomersupport.Backend.DTO.KnowledgeRequest;
import com.intelligentcustomersupport.Backend.DTO.KnowledgeResponse;
import com.intelligentcustomersupport.Backend.DTO.TriageRequest;
import com.intelligentcustomersupport.Backend.DTO.TriageResponse;
import com.intelligentcustomersupport.Backend.Entity.Department;
import com.intelligentcustomersupport.Backend.Entity.Ticket;
import com.intelligentcustomersupport.Backend.Repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final PythonAIService pythonAIService;
    private final EscalationService escalationService;

    public TicketService(
            TicketRepository ticketRepository,
            PythonAIService pythonAIService,
            EscalationService escalationService) {

        this.ticketRepository = ticketRepository;
        this.pythonAIService = pythonAIService;
        this.escalationService = escalationService;
    }

    public Ticket createTicket(Ticket ticket) {

        // Save first so the ticket gets an ID.
        ticket.setStatus("OPEN");
        ticket = ticketRepository.save(ticket);

        // 1. AI TRIAGE
        TriageRequest triageRequest = new TriageRequest();
        triageRequest.setComplaint(ticket.getMessage());
        triageRequest.setConversationHistory(List.of());

        TriageResponse triage = pythonAIService.triage(triageRequest);

        // 2. Store AI findings
        ticket.setAiIntent(triage.getIntent());
        ticket.setAiCategory(triage.getCategory());
        ticket.setAiSentiment(triage.getSentiment());
        ticket.setAiUrgency(triage.getUrgency());

        if (triage.getMissingInformation() != null) {
            ticket.setAiMissingInformation(
                    String.join(", ", triage.getMissingInformation())
            );
        }

        ticket.setAiConfidence(triage.getConfidence());
        ticket.setAiRequiresQuestion(triage.isRequiresQuestion());
        ticket.setAiNextQuestion(triage.getNextQuestion());
        ticket.setAiRecommendedAction(triage.getRecommendedAction());
        ticket.setAiRiskLevel(triage.getRiskLevel());

        // 3. AI CATEGORY → DEPARTMENT
        ticket.setDepartment(routeByAI(triage.getCategory()));

        // 4. KNOWLEDGE / RAG
        // If AI needs more information first, ask the question.
        // Otherwise, use the knowledge engine.
        if (!triage.isRequiresQuestion()) {

            KnowledgeRequest knowledgeRequest = new KnowledgeRequest();
            knowledgeRequest.setQuestion(ticket.getMessage());

            KnowledgeResponse knowledge =
                    pythonAIService.queryKnowledge(knowledgeRequest);

            ticket.setKnowledgeAnswer(knowledge.getAnswer());

            if (knowledge.getSources() != null) {
                ticket.setKnowledgeSources(
                        String.join(", ", knowledge.getSources())
                );
            }

            ticket.setRequiresEscalation(
                    knowledge.isRequiresEscalation()
            );
        }

        // Save current AI/knowledge information.
        ticket = ticketRepository.save(ticket);

        // 5. ESCALATION
        String severity = calculateSeverity(
                triage.getRiskLevel(),
                triage.getUrgency()
        );

        String riskSignals = buildRiskSignals(
                triage.getRiskLevel(),
                triage.getCategory()
        );

        escalationService.evaluateEscalation(
                ticket.getId(),
                severity,
                triage.getUrgency(),
                triage.getConfidence(),
                riskSignals
        );

        // Get latest ticket state after escalation evaluation.
        return ticketRepository.findById(ticket.getId()).orElse(ticket);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id).orElse(null);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket updateStatus(Long id, String status) {

        Ticket ticket = ticketRepository.findById(id).orElse(null);

        if (ticket == null) {
            return null;
        }

        if (!ALLOWED_STATUSES.contains(status)) {
            throw new IllegalArgumentException("Invalid ticket status");
        }

        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    private static final Set<String> ALLOWED_STATUSES =
            Set.of(
                    "OPEN",
                    "IN_PROGRESS",
                    "RESOLVED",
                    "ESCALATED",
                    "CLOSED"
            );

    // AI category → Spring Department
    private Department routeByAI(String category) {

        if (category == null) {
            return Department.GENERAL;
        }

        String value = category.toLowerCase();

        if (value.contains("payment")
                || value.contains("refund")
                || value.contains("billing")) {
            return Department.PAYMENT;
        }

        if (value.contains("order")
                || value.contains("delivery")
                || value.contains("shipment")) {
            return Department.ORDER;
        }

        if (value.contains("account")
                || value.contains("login")
                || value.contains("security")) {
            return Department.ACCOUNT;
        }

        if (value.contains("technical")
                || value.contains("bug")
                || value.contains("error")) {
            return Department.TECHNICAL;
        }

        return Department.GENERAL;
    }

    // Convert AI risk/urgency into the severity expected
    // by the deterministic escalation service.
    private String calculateSeverity(
            String riskLevel,
            String urgency) {

        if ("critical".equalsIgnoreCase(riskLevel)) {
            return "CRITICAL";
        }

        if ("high".equalsIgnoreCase(riskLevel)
                || "high".equalsIgnoreCase(urgency)) {
            return "HIGH";
        }

        if ("medium".equalsIgnoreCase(riskLevel)
                || "medium".equalsIgnoreCase(urgency)) {
            return "MEDIUM";
        }

        return "LOW";
    }

    private String buildRiskSignals(
            String riskLevel,
            String category) {

        if (riskLevel == null) {
            return "LOW";
        }

        return riskLevel.toUpperCase();
    }
}