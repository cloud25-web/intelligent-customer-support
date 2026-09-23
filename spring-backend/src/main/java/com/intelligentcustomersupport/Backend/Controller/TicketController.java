package com.intelligentcustomersupport.Backend.Controller;

import com.intelligentcustomersupport.Backend.Service.TicketService;
import org.springframework.web.bind.annotation.RestController;
import com.intelligentcustomersupport.Backend.Entity.Ticket;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.intelligentcustomersupport.Backend.DTO.TicketRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController

public class TicketController {
    private final TicketService ticketService;
      public TicketController(TicketService ticketService){
           this.ticketService = ticketService;
      }


       @PostMapping("/api/tickets")
       public Ticket createTicket(@Valid @RequestBody TicketRequest request){
           Ticket ticket = new Ticket();
           ticket.setCustomerId(request.getCustomerId());
           ticket.setMessage(request.getMessage());
          return ticketService.createTicket(ticket);
       }

    @GetMapping("/api/tickets/{id}")
    public Ticket getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    @GetMapping("/api/tickets")
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @PutMapping("/api/tickets/{id}/status")
    public Ticket updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ticketService.updateStatus(id, status);
    }
}
