package com.intelligentcustomersupport.Backend.Repository;

import com.intelligentcustomersupport.Backend.Entity.Escalation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EscalationRepository extends JpaRepository<Escalation, Long> {

    List<Escalation> findByTicketId(Long ticketId);
}
