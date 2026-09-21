package com.farmshare.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 20)
    private String mobile;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Column(nullable = false, length = 30)
    private String role; // FARMER, OWNER, ADMIN

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, BLOCKED

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "verification_status", nullable = false, length = 30)
    private String verificationStatus = "APPROVED"; // PENDING, APPROVED, REJECTED

    private String village;
    private String district;
    private String state;

    @Column(name = "land_acreage", precision = 6, scale = 2)
    private BigDecimal landAcreage;

    @Column(name = "govt_id_type", length = 50)
    private String govtIdType;

    @Column(name = "govt_id_number", length = 100)
    private String govtIdNumber;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { 
        this.status = status; 
        this.isActive = "ACTIVE".equalsIgnoreCase(status);
    }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public BigDecimal getLandAcreage() { return landAcreage; }
    public void setLandAcreage(BigDecimal landAcreage) { this.landAcreage = landAcreage; }

    public String getGovtIdType() { return govtIdType; }
    public void setGovtIdType(String govtIdType) { this.govtIdType = govtIdType; }

    public String getGovtIdNumber() { return govtIdNumber; }
    public void setGovtIdNumber(String govtIdNumber) { this.govtIdNumber = govtIdNumber; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
