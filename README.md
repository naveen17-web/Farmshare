# FarmShare - Agricultural Equipment Rental Platform

A modern, full-stack digital platform connecting smallholder farmers with tractor & heavy machinery owners.

---

## 🏛️ Project Architecture

```
FarmShare/
│
├── backend/                                # Complete Java Spring Boot 3.2 Backend
│   ├── pom.xml                             # Maven build with JPA, Security, JWT, MySQL, H2
│   ├── README.md                           # Spring Boot backend guide & API catalog
│   └── src/
│       └── main/
│           ├── java/com/farmshare/
│           │   ├── FarmShareApplication.java  # @SpringBootApplication main entry point
│           │   ├── config/                 # SecurityConfig, CorsConfig, JwtTokenProvider, JwtFilter
│           │   ├── controller/             # REST API Controllers (Auth, Equipment, Bookings, Reviews, Admin, Support)
│           │   ├── dto/                    # Request/Response DTOs
│           │   ├── entity/                 # JPA Entities (User, Equipment, Booking, Review, Complaint, Payment)
│           │   ├── repository/             # Spring Data JPA Repositories
│           │   └── service/                # Business logic & transaction management
│           └── resources/
│               ├── application.properties  # Port 8080 configuration, H2 & MySQL profiles
│               ├── schema.sql              # Relational DDL tables with foreign keys & indexes
│               └── data.sql                # Initial agricultural dataset & seed accounts
│
├── src/                                    # Frontend React 19 & TypeScript Application
│   ├── components/                         # Modular UI views & portals
│   │   ├── Navbar.tsx                      # Main navigation & role switcher
│   │   ├── HomePage.tsx                    # Agricultural landing & live search
│   │   ├── EquipmentListingPage.tsx        # Filterable machinery catalog with pricing calculator
│   │   ├── EquipmentDetailPage.tsx         # Detailed specifications, availability & booking modal
│   │   ├── FarmerPortal.tsx                # Farmer dashboard, active rentals, OTP confirmation
│   │   ├── OwnerPortal.tsx                 # Owner machinery listing, revenue tracking, approvals
│   │   ├── AdminPortal.tsx                 # Admin user control, grievance redressal, center management
│   │   ├── CodeExplorerModal.tsx           # In-app interactive Java & SQL backend code browser
│   │   ├── AuthModal.tsx                   # Role-based login and registration dialog
│   │   ├── Footer.tsx                      # Multilingual agricultural footer & quick links
│   │   └── ...
│   ├── context/
│   │   └── AppContext.tsx                  # Global state management with reactive persistence
│   ├── data/
│   │   └── initialData.ts                  # Comprehensive initial equipment, users & booking records
│   ├── types.ts                            # Shared TypeScript interfaces & types
│   ├── main.tsx                            # React entry point
│   ├── App.tsx                             # Top-level view routing & modal orchestration
│   └── index.css                           # Tailwind CSS styling
│
├── index.html                              # HTML5 template
├── package.json                            # Frontend dependencies (React 19, Lucide, Tailwind, Motion)
├── tsconfig.json                           # TypeScript configuration
├── vite.config.ts                          # Vite build & bundler configuration
└── README.md                               # Comprehensive project documentation
```

---

## ⚡ Quick Start Guide

### 1. Running the Spring Boot Java Backend (`backend/`)

#### Prerequisites:
- Java 17 or higher (`java -version`)
- Maven 3.8+ (`mvn -version`)

```bash
# Navigate to the backend directory
cd backend

# Build and run with Spring Boot (runs with in-memory H2 DB by default)
mvn clean spring-boot:run
```

- **Backend API Base URL**: `http://localhost:8080/api`
- **H2 Interactive Database Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:farmsharedb`
  - User: `sa`
  - Password: *(leave blank)*

*(To use MySQL instead, simply update `backend/src/main/resources/application.properties` with your MySQL database URL and credentials).*

---

### 2. Running the React Frontend

#### Prerequisites:
- Node.js 18+ and npm (`node -v`)

```bash
# In the project root directory
npm install

# Start Vite dev server
npm run dev
```

- **Frontend App URL**: `http://localhost:3000`

---

## 🔑 Demo Credentials

| Role | Name | Email | Password | Access Highlights |
|---|---|---|---|---|
| **Admin** | Admin Officer | `admin@farmshare.gov.in` | `admin123` | System oversight, user activation, grievance redressal, support centers |
| **Farmer** | Gurpreet Singh | `gurpreet.farmer@example.com` | `farmer123` | Equipment discovery, hourly/daily booking, OTP confirmation, reviews |
| **Owner** | Ramesh Kumar | `ramesh.kumar@example.com` | `owner123` | Machinery fleet management, booking requests, earnings breakdown |

---

## 📦 Exporting & Deploying This Project

When you export this repository (via ZIP download or GitHub export):
1. **Frontend and Backend are clearly separated**:
   - `backend/` contains standard Maven project files (`pom.xml`, `.java` source code, SQL migrations).
   - `src/` contains modern React + TypeScript + Tailwind CSS code.
2. Both projects can be opened simultaneously in VS Code, IntelliJ IDEA, or Eclipse.
3. The codebase includes an interactive **Java & SQL Code Inspector** accessible directly from the navigation bar for easy code inspection and presentation.
