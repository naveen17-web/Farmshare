# FarmShare Backend - Spring Boot 3 & JPA Architecture

Production-grade Spring Boot 3.2 backend for the FarmShare Agricultural Equipment Rental platform.

## 📁 Package & File Layout

```
backend/
├── pom.xml                                 # Maven configuration with Spring Boot 3, JPA, Security, JWT, MySQL, H2
├── README.md                               # Backend architecture & execution guide
└── src/
    └── main/
        ├── java/com/farmshare/
        │   ├── FarmShareApplication.java   # Spring Boot entry point (@SpringBootApplication)
        │   ├── config/                     # Security, JWT, and CORS setup
        │   │   ├── CorsConfig.java         # Allowed origins (localhost:3000, localhost:5173)
        │   │   ├── JwtAuthenticationFilter.java # OncePerRequestFilter for Bearer tokens
        │   │   ├── JwtTokenProvider.java   # Token generation and validation
        │   │   └── SecurityConfig.java     # RBAC endpoints & BCrypt password encoder
        │   ├── controller/                 # REST API Controllers (@RestController)
        │   │   ├── AdminController.java    # /api/admin/* (user management, owner verification)
        │   │   ├── AuthController.java     # /api/auth/* (login, register)
        │   │   ├── BookingController.java  # /api/bookings/* (create, status, cancel)
        │   │   ├── ComplaintController.java# /api/complaints/* (tickets, grievances)
        │   │   ├── EquipmentController.java# /api/equipment/* (CRUD, search, filtering)
        │   │   ├── ReviewController.java   # /api/reviews/* (rating, farmer feedback)
        │   │   └── SupportCenterController.java # /api/support-centers/* (nodal centers)
        │   ├── dto/                        # Request and response data transfer objects
        │   │   ├── AuthRequest.java
        │   │   ├── AuthResponse.java
        │   │   ├── BookingRequest.java
        │   │   ├── ComplaintRequest.java
        │   │   ├── EquipmentRequest.java
        │   │   ├── RegisterRequest.java
        │   │   └── ReviewRequest.java
        │   ├── entity/                     # JPA Entities mapping database tables
        │   │   ├── Booking.java
        │   │   ├── Complaint.java
        │   │   ├── Equipment.java
        │   │   ├── Payment.java
        │   │   ├── Review.java
        │   │   ├── SupportCenter.java
        │   │   └── User.java
        │   ├── repository/                 # Spring Data JPA Repositories
        │   │   ├── BookingRepository.java
        │   │   ├── ComplaintRepository.java
        │   │   ├── EquipmentRepository.java
        │   │   ├── PaymentRepository.java
        │   │   ├── ReviewRepository.java
        │   │   ├── SupportCenterRepository.java
        │   │   └── UserRepository.java
        │   └── service/                    # Business Logic Layer
        │       ├── BookingService.java
        │       ├── ComplaintService.java
        │       ├── EquipmentService.java
        │       ├── ReviewService.java
        │       └── UserService.java
        └── resources/
            ├── application.properties      # Port 8080, H2 / MySQL profile toggle
            ├── data.sql                    # Seed data (demo farmers, owners, tractors, bookings)
            └── schema.sql                  # Complete relational DDL
```

## 🚀 How to Run the Backend

### Prerequisites
- **Java 17 or 21** installed (`java -version`)
- **Maven 3.8+** installed (`mvn -v`) OR use the bundled maven wrapper

### 1. Quick Start (H2 In-Memory - Zero setup required)
By default, `application.properties` uses `spring.profiles.active=dev` with an embedded H2 database. Tables and initial seed data are loaded automatically from `schema.sql` and `data.sql`.

```bash
cd backend
mvn clean spring-boot:run
```

- Backend server: `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:farmsharedb`, User: `sa`, Password: empty)

### 2. Running with MySQL 8+
To connect to a live MySQL instance:
1. Create database:
   ```sql
   CREATE DATABASE farmshare_db;
   ```
2. Update `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/farmshare_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```
3. Run the application:
   ```bash
   mvn clean spring-boot:run
   ```

## 📡 REST API Summary

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT token |
| `POST` | `/api/auth/register` | Public | Register new Farmer or Owner |
| `GET` | `/api/equipment` | Public | List all available tractors, harvesters, etc. |
| `GET` | `/api/equipment/{id}` | Public | Get equipment details by ID |
| `POST` | `/api/equipment` | Owner/Admin | List new machinery for rent |
| `GET` | `/api/bookings/farmer/{farmerId}` | Farmer/Admin | Retrieve all bookings for a farmer |
| `POST` | `/api/bookings` | Farmer/Admin | Book equipment (hourly or daily) with OTP generation |
| `PUT` | `/api/bookings/{id}/status` | Authenticated | Update status (ACTIVE, COMPLETED, CANCELLED) |
| `GET` | `/api/reviews/equipment/{equipmentId}` | Public | Read equipment reviews and ratings |
| `POST` | `/api/reviews` | Farmer/Admin | Submit review after completed booking |
| `POST` | `/api/complaints` | Authenticated | Submit grievance ticket |
| `GET` | `/api/admin/users` | Admin | Manage all users and status |
| `PUT` | `/api/admin/users/{id}/toggle-status` | Admin | Activate or deactivate user |
| `PUT` | `/api/admin/owners/{id}/verify` | Admin | Approve or reject owner registration |
