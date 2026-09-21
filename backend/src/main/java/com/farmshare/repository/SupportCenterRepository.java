package com.farmshare.repository;

import com.farmshare.entity.SupportCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupportCenterRepository extends JpaRepository<SupportCenter, Long> {
    Optional<SupportCenter> findByCenterCode(String centerCode);
}
