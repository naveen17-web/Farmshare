package com.farmshare.controller;

import com.farmshare.entity.User;
import com.farmshare.service.BookingService;
import com.farmshare.service.EquipmentService;
import com.farmshare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private EquipmentService equipmentService;

    @Autowired
    private BookingService bookingService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
    }

    @PutMapping("/owners/{id}/verify")
    public ResponseEntity<User> verifyOwner(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(userService.setOwnerVerificationStatus(id, status));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getAdminMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalUsers", userService.getAllUsers().size());
        metrics.put("totalEquipment", equipmentService.getAllEquipment().size());
        metrics.put("totalBookings", bookingService.getAllBookings().size());
        return ResponseEntity.ok(metrics);
    }
}
