package com.farmshare.service;

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
import java.util.Optional;
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

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByFarmer(Long farmerId) {
        return bookingRepository.findByFarmerId(farmerId);
    }

    public List<Booking> getBookingsByOwner(Long ownerId) {
        return bookingRepository.findByEquipmentOwnerId(ownerId);
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

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
        booking.setPickupNotes(req.getPickupNotes());

        // Generate 4-digit OTP code for secure handover
        int otp = 1000 + new Random().nextInt(9000);
        booking.setOtpCode(String.valueOf(otp));

        Booking savedBooking = bookingRepository.save(booking);

        // Record payment
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

    public Booking updateStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        booking.setStatus(status.toUpperCase());
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        booking.setStatus("CANCELLED");
        booking.setPaymentStatus("REFUNDED");
        return bookingRepository.save(booking);
    }
}
