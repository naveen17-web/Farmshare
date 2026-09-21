package com.farmshare.controller;

import com.farmshare.dto.ComplaintRequest;
import com.farmshare.entity.Complaint;
import com.farmshare.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Complaint>> getComplaintsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(complaintService.getComplaintsByUser(userId));
    }

    @PostMapping
    public ResponseEntity<Complaint> submitComplaint(@Valid @RequestBody ComplaintRequest request) {
        Complaint complaint = complaintService.submitComplaint(request);
        return ResponseEntity.ok(complaint);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Complaint> updateComplaintStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String adminNotes) {
        Complaint updated = complaintService.updateStatus(id, status, adminNotes);
        return ResponseEntity.ok(updated);
    }
}
