package com.farmshare;

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
}
