import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Database, Settings, Shield, Server, FolderTree } from 'lucide-react';

interface CodeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CodeFile {
  id: string;
  name: string;
  category: 'controller' | 'service' | 'entity' | 'config' | 'sql' | 'build';
  path: string;
  language: string;
  icon: any;
  content: string;
}

const BACKEND_FILES: CodeFile[] = [
  {
    id: 'app',
    name: 'FarmShareApplication.java',
    category: 'build',
    path: 'backend/src/main/java/com/farmshare/FarmShareApplication.java',
    language: 'java',
    icon: Server,
    content: `package com.farmshare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * FarmShare Agricultural Equipment Rental Backend Application
 * Provides secure REST APIs for Farmers, Equipment Owners, and Government/Admins.
 */
@SpringBootApplication
public class FarmShareApplication {

    public static void main(String[] args) {
        SpringApplication.run(FarmShareApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🌱 FarmShare Spring Boot Backend Started on 8080");
        System.out.println("📡 REST APIs available at /api/*");
        System.out.println("💾 H2 In-Memory Console available at /h2-console");
        System.out.println("=================================================");
    }
}`
  },
  {
    id: 'equipment-entity',
    name: 'Equipment.java',
    category: 'entity',
    path: 'backend/src/main/java/com/farmshare/entity/Equipment.java',
    language: 'java',
    icon: FileCode,
    content: `package com.farmshare.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 50)
    private String category; // Tractors, Harvesters, Cultivators, Tillers, etc.

    @Column(nullable = false, length = 100)
    private String brand;

    @Column(name = "model_year", nullable = false)
    private Integer modelYear;

    @Column(name = "hp_power")
    private Integer hpPower;

    @Column(name = "registration_number", length = 100)
    private String registrationNumber;

    @Column(name = "hourly_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(name = "daily_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyRate;

    @Column(name = "security_deposit", precision = 10, scale = 2)
    private BigDecimal securityDeposit = BigDecimal.ZERO;

    private String address;
    private String village;
    private String district;
    private String state;

    @Column(columnDefinition = "TEXT")
    private String specifications;

    @Column(columnDefinition = "TEXT")
    private String features;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false, length = 30)
    private String status = "AVAILABLE"; // AVAILABLE, RENTED, UNDER_MAINTENANCE

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters omitted for brevity
}`
  },
  {
    id: 'booking-entity',
    name: 'Booking.java',
    category: 'entity',
    path: 'backend/src/main/java/com/farmshare/entity/Booking.java',
    language: 'java',
    icon: FileCode,
    content: `package com.farmshare.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Column(name = "booking_type", nullable = false, length = 20)
    private String bookingType; // HOURLY, DAILY

    @Column(name = "start_date", nullable = false, length = 50)
    private String startDate;

    @Column(name = "end_date", nullable = false, length = 50)
    private String endDate;

    @Column(name = "total_hours")
    private Integer totalHours = 0;

    @Column(name = "total_days")
    private Integer totalDays = 0;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false, length = 30)
    private String status = "CONFIRMED"; // PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED

    @Column(name = "payment_status", nullable = false, length = 30)
    private String paymentStatus = "PAID"; // PENDING, PAID, REFUNDED

    @Column(name = "otp_code", length = 10)
    private String otpCode;

    @Column(name = "pickup_notes", columnDefinition = "TEXT")
    private String pickupNotes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}`
  },
  {
    id: 'equipment-ctrl',
    name: 'EquipmentController.java',
    category: 'controller',
    path: 'backend/src/main/java/com/farmshare/controller/EquipmentController.java',
    language: 'java',
    icon: Server,
    content: `package com.farmshare.controller;

import com.farmshare.dto.EquipmentRequest;
import com.farmshare.entity.Equipment;
import com.farmshare.service.EquipmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<List<Equipment>> getAllEquipment(
            @RequestParam(value = "search", required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(equipmentService.searchEquipment(search));
        }
        return ResponseEntity.ok(equipmentService.getAllEquipment());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable Long id) {
        return equipmentService.getEquipmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<Equipment> createEquipment(@Valid @RequestBody EquipmentRequest request) {
        Equipment created = equipmentService.createEquipment(request);
        return ResponseEntity.ok(created);
    }
}`
  },
  {
    id: 'booking-service',
    name: 'BookingService.java',
    category: 'service',
    path: 'backend/src/main/java/com/farmshare/service/BookingService.java',
    language: 'java',
    icon: FileCode,
    content: `package com.farmshare.service;

import com.farmshare.dto.BookingRequest;
import com.farmshare.entity.Booking;
import com.farmshare.entity.Equipment;
import com.farmshare.entity.Payment;
import com.farmshare.entity.User;
import com.farmshare.repository.BookingRepository;
import com.farmshare.repository.EquipmentRepository;
import com.farmshare.repository.PaymentRepository;
import com.farmshare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public Booking createBooking(BookingRequest req) {
        User farmer = userRepository.findById(req.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found: " + req.getFarmerId()));

        Equipment equipment = equipmentRepository.findById(req.getEquipmentId())
                .orElseThrow(() -> new RuntimeException("Equipment not found: " + req.getEquipmentId()));

        Booking booking = new Booking();
        booking.setFarmer(farmer);
        booking.setEquipment(equipment);
        booking.setBookingType(req.getBookingType());
        booking.setStartDate(req.getStartDate());
        booking.setEndDate(req.getEndDate());
        booking.setTotalHours(req.getTotalHours() != null ? req.getTotalHours() : 0);
        booking.setTotalDays(req.getTotalDays() != null ? req.getTotalDays() : 0);
        booking.setTotalAmount(req.getTotalAmount());
        booking.setStatus("CONFIRMED");
        booking.setPaymentStatus("PAID");

        // 4-digit handover security OTP
        int otp = 1000 + new Random().nextInt(9000);
        booking.setOtpCode(String.valueOf(otp));

        Booking savedBooking = bookingRepository.save(booking);

        // Process demo payment transaction
        Payment payment = new Payment();
        payment.setBooking(savedBooking);
        payment.setPayer(farmer);
        payment.setAmount(req.getTotalAmount());
        payment.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "UPI");
        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setStatus("SUCCESSFUL");
        paymentRepository.save(payment);

        return savedBooking;
    }
}`
  },
  {
    id: 'security-config',
    name: 'SecurityConfig.java',
    category: 'config',
    path: 'backend/src/main/java/com/farmshare/config/SecurityConfig.java',
    language: 'java',
    icon: Shield,
    content: `package com.farmshare.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/equipment/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/owner/**").hasAnyRole("OWNER", "ADMIN")
                .requestMatchers("/api/farmer/**").hasAnyRole("FARMER", "ADMIN")
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}`
  },
  {
    id: 'schema-sql',
    name: 'schema.sql',
    category: 'sql',
    path: 'backend/src/main/resources/schema.sql',
    language: 'sql',
    icon: Database,
    content: `-- FarmShare Database Schema (DDL)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'FARMER',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'APPROVED',
    village VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS equipment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model_year INT NOT NULL,
    hp_power INT,
    hourly_rate DECIMAL(10,2) NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) DEFAULT 0.0,
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    CONSTRAINT fk_equipment_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    equipment_id BIGINT NOT NULL,
    booking_type VARCHAR(20) NOT NULL,
    start_date VARCHAR(50) NOT NULL,
    end_date VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    otp_code VARCHAR(10),
    CONSTRAINT fk_booking_farmer FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
);`
  },
  {
    id: 'pom-xml',
    name: 'pom.xml',
    category: 'build',
    path: 'backend/pom.xml',
    language: 'xml',
    icon: Settings,
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.4</version>
    </parent>
    <groupId>com.farmshare</groupId>
    <artifactId>farmshare-backend</artifactId>
    <version>1.0.0</version>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
        </dependency>
    </dependencies>
</project>`
  }
];

export const CodeExplorerModal: React.FC<CodeExplorerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(BACKEND_FILES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        id="code-explorer-modal"
        className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/80 border border-emerald-700/50 rounded-lg text-emerald-400">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-stone-100 font-bold text-base flex items-center gap-2">
                <span>Project Architecture & Java Backend Code</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
                  Spring Boot 3 + JPA
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                All source files exist in <code className="text-emerald-400 font-mono">/backend</code> and are ready to export via ZIP or GitHub.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Sidebar + Editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-64 border-r border-stone-800 bg-stone-950/60 p-3 overflow-y-auto flex flex-col gap-1">
            <div className="text-[10px] uppercase tracking-wider font-bold text-stone-500 px-3 py-1">
              Backend Source (.java & .sql)
            </div>

            {BACKEND_FILES.map((file) => {
              const Icon = file.icon;
              const isSelected = selectedFile.id === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-stone-500'}`} />
                  <span className="truncate">{file.name}</span>
                </button>
              );
            })}

            <div className="mt-auto pt-4 border-t border-stone-800 text-[11px] text-stone-400 px-2 leading-relaxed">
              <span className="text-stone-300 font-semibold block mb-1">📦 Export Structure:</span>
              • <code className="text-emerald-400">/backend</code>: Java Spring Boot<br />
              • <code className="text-amber-400">/src</code>: React 19 Frontend<br />
              • <code className="text-sky-400">README.md</code>: Build commands
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-stone-900 overflow-hidden">
            {/* Top Bar for Code View */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900 border-b border-stone-800 text-xs">
              <span className="font-mono text-stone-300 truncate">
                {selectedFile.path}
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md flex items-center gap-1.5 transition text-xs font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Content */}
            <pre className="flex-1 p-5 overflow-auto text-xs font-mono leading-relaxed text-stone-200 bg-stone-950 select-text">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
