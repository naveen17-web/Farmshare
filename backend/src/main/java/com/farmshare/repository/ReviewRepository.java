package com.farmshare.repository;

import com.farmshare.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByEquipmentId(Long equipmentId);
    List<Review> findByFarmerId(Long farmerId);
    boolean existsByBookingId(Long bookingId);
}
