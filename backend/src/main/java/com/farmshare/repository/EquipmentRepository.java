package com.farmshare.repository;

import com.farmshare.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    List<Equipment> findByOwnerId(Long ownerId);
    List<Equipment> findByCategory(String category);
    List<Equipment> findByStatus(String status);
    List<Equipment> findByDistrictIgnoreCase(String district);
    List<Equipment> findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrBrandContainingIgnoreCase(
        String title, String category, String brand
    );
}
