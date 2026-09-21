package com.farmshare.repository;

import com.farmshare.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByTicketNumber(String ticketNumber);
    List<Complaint> findByUserId(Long userId);
    List<Complaint> findByStatus(String status);
}
