package com.farmshare.service;

import com.farmshare.dto.ComplaintRequest;
import com.farmshare.entity.Complaint;
import com.farmshare.entity.User;
import com.farmshare.repository.ComplaintRepository;
import com.farmshare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getComplaintsByUser(Long userId) {
        return complaintRepository.findByUserId(userId);
    }

    public Complaint submitComplaint(ComplaintRequest req) {
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + req.getUserId()));

        Complaint c = new Complaint();
        c.setTicketNumber("TKT-" + (1000 + new Random().nextInt(9000)));
        c.setUser(user);
        c.setUserName(user.getFullName());
        c.setUserRole(user.getRole());
        c.setSubject(req.getSubject());
        c.setMessage(req.getMessage());
        c.setStatus("PENDING");

        return complaintRepository.save(c);
    }

    public Complaint updateStatus(Long complaintId, String status, String adminNotes) {
        Complaint c = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + complaintId));

        c.setStatus(status.toUpperCase());
        if (adminNotes != null) {
            c.setAdminNotes(adminNotes);
        }

        return complaintRepository.save(c);
    }
}
