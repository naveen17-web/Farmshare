package com.farmshare.repository;

import com.farmshare.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByFarmerId(Long farmerId);
    List<Booking> findByEquipmentOwnerId(Long ownerId);
    List<Booking> findByEquipmentId(Long equipmentId);
    List<Booking> findByStatus(String status);
}
