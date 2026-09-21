package com.farmshare.service;

import com.farmshare.dto.ReviewRequest;
import com.farmshare.entity.Booking;
import com.farmshare.entity.Equipment;
import com.farmshare.entity.Review;
import com.farmshare.entity.User;
import com.farmshare.repository.BookingRepository;
import com.farmshare.repository.EquipmentRepository;
import com.farmshare.repository.ReviewRepository;
import com.farmshare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Review> getReviewsForEquipment(Long equipmentId) {
        return reviewRepository.findByEquipmentId(equipmentId);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review createReview(ReviewRequest req) {
        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found: " + req.getBookingId()));

        Equipment equipment = equipmentRepository.findById(req.getEquipmentId())
                .orElseThrow(() -> new RuntimeException("Equipment not found: " + req.getEquipmentId()));

        User farmer = userRepository.findById(req.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found: " + req.getFarmerId()));

        if (reviewRepository.existsByBookingId(req.getBookingId())) {
            throw new RuntimeException("Booking has already been reviewed.");
        }

        Review review = new Review();
        review.setBooking(booking);
        review.setEquipment(equipment);
        review.setFarmer(farmer);
        review.setRating(req.getRating());
        review.setComment(req.getComment());

        return reviewRepository.save(review);
    }

    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}
