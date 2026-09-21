package com.farmshare.controller;

import com.farmshare.entity.SupportCenter;
import com.farmshare.repository.SupportCenterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support-centers")
public class SupportCenterController {

    @Autowired
    private SupportCenterRepository supportCenterRepository;

    @GetMapping
    public ResponseEntity<List<SupportCenter>> getAllCenters() {
        return ResponseEntity.ok(supportCenterRepository.findAll());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SupportCenter> updateSupportCenter(
            @PathVariable Long id,
            @RequestBody SupportCenter updated) {
        return supportCenterRepository.findById(id).map(center -> {
            center.setName(updated.getName());
            center.setAddress(updated.getAddress());
            center.setDistrict(updated.getDistrict());
            center.setState(updated.getState());
            center.setContactNumber(updated.getContactNumber());
            center.setEmail(updated.getEmail());
            center.setOperatingHours(updated.getOperatingHours());
            return ResponseEntity.ok(supportCenterRepository.save(center));
        }).orElse(ResponseEntity.notFound().build());
    }
}
