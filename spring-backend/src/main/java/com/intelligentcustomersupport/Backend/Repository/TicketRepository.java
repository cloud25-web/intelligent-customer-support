package com.intelligentcustomersupport.Backend.Repository;
import com.intelligentcustomersupport.Backend.Entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket ,Long> {

}
