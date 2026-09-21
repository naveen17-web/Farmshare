-- ===================================================================
-- FarmShare Initial Seed Data
-- ===================================================================

-- Users (Admin, Owners, Farmers)
INSERT INTO users (id, full_name, email, mobile, password_hash, role, status, is_active, verification_status, village, district, state) VALUES
(1, 'Admin Officer', 'admin@farmshare.gov.in', '9876543210', '$2a$10$w09ZkMvR5Q74X67Y7P7dTe3m4R3n.8k7A6e5Y7i9O0P1q2R3s4T5u', 'ADMIN', 'ACTIVE', TRUE, 'APPROVED', 'District Agriland', 'Ludhiana', 'Punjab'),
(2, 'Ramesh Kumar (Owner)', 'ramesh.kumar@example.com', '9876501234', '$2a$10$w09ZkMvR5Q74X67Y7P7dTe3m4R3n.8k7A6e5Y7i9O0P1q2R3s4T5u', 'OWNER', 'ACTIVE', TRUE, 'APPROVED', 'Kisan Nagar', 'Ludhiana', 'Punjab'),
(3, 'Gurpreet Singh (Farmer)', 'gurpreet.farmer@example.com', '9812345678', '$2a$10$w09ZkMvR5Q74X67Y7P7dTe3m4R3n.8k7A6e5Y7i9O0P1q2R3s4T5u', 'FARMER', 'ACTIVE', TRUE, 'APPROVED', 'Green Valley', 'Patiala', 'Punjab'),
(4, 'Suresh Patel (Owner)', 'suresh.patel@example.com', '9988776655', '$2a$10$w09ZkMvR5Q74X67Y7P7dTe3m4R3n.8k7A6e5Y7i9O0P1q2R3s4T5u', 'OWNER', 'ACTIVE', TRUE, 'PENDING', 'Sardar Pur', 'Anand', 'Gujarat');

-- Equipment
INSERT INTO equipment (id, owner_id, title, category, brand, model_year, hp_power, registration_number, hourly_rate, daily_rate, security_deposit, address, village, district, state, pincode, specifications, features, image_url, status) VALUES
(101, 2, 'John Deere 5050D (50 HP) Multi-Utility Tractor', 'Tractors', 'John Deere', 2022, 50, 'PB-10-AB-4321', 450.00, 3200.00, 2000.00, 'Farm Sector 12, GT Road', 'Kisan Nagar', 'Ludhiana', 'Punjab', '141001', '50 HP, 8F+4R Gearbox, Dual Clutch, Oil Immersed Brakes', 'Power steering, GPS tracker, Fuel efficient engine', 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=60', 'AVAILABLE'),
(102, 2, 'Mahindra 575 DI Sarpanch Heavy Cultivator', 'Tractors', 'Mahindra', 2021, 45, 'PB-10-CD-9876', 400.00, 2800.00, 1500.00, 'Near Grain Mandi', 'Kisan Nagar', 'Ludhiana', 'Punjab', '141001', '45 HP, 4 Cylinder, Advanced Hydrolift', 'High torque, Easy maintenance, Implements compatible', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=60', 'AVAILABLE'),
(103, 2, 'Claas Crop Tiger 40 Combine Harvester', 'Harvesters', 'Claas', 2023, 75, 'PB-10-EF-5544', 1200.00, 8500.00, 5000.00, 'Agro Hub, Bypass Road', 'Kisan Nagar', 'Ludhiana', 'Punjab', '141002', '75 HP Turbocharged, Grain tank 1400L, Wide Cutterbar', 'High grain purity, Minimal straw loss, Air-conditioned cabin', 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=60', 'AVAILABLE');

-- Bookings
INSERT INTO bookings (id, farmer_id, equipment_id, booking_type, start_date, end_date, total_hours, total_days, total_amount, status, payment_status, otp_code, pickup_notes) VALUES
(1001, 3, 101, 'DAILY', '2026-09-10', '2026-09-12', 0, 3, 9600.00, 'COMPLETED', 'PAID', '4821', 'Pickup from farm shed #2 near gate.'),
(1002, 3, 102, 'HOURLY', '2026-09-18', '2026-09-18', 6, 0, 2400.00, 'CONFIRMED', 'PAID', '6790', 'Field plowing for upcoming wheat cycle.');

-- Reviews
INSERT INTO reviews (id, booking_id, equipment_id, farmer_id, rating, comment) VALUES
(201, 1001, 101, 3, 5, 'Superb tractor! Runs smooth and consumed very little diesel for 3 continuous days.');

-- Complaints
INSERT INTO complaints (id, ticket_number, user_id, user_name, user_role, subject, message, status, admin_notes) VALUES
(301, 'TKT-1082', 3, 'Gurpreet Singh (Farmer)', 'FARMER', 'Billing discrepancy clarification on security deposit', 'Wanted confirmation regarding deposit refund processing time.', 'RESOLVED', 'Refund of security deposit processed to bank on 13 Sep.');

-- Support Centers
INSERT INTO support_centers (id, name, center_code, address, district, state, contact_number, email, operating_hours) VALUES
(1, 'Central Agricultural Assistance Hub', 'HUB-PB-01', 'Kisan Bhawan, Near Mandi Gate', 'Ludhiana', 'Punjab', '+91 1800-456-7890', 'support.ludhiana@farmshare.gov.in', '08:00 AM - 08:00 PM (All 7 Days)');
