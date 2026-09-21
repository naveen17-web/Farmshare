package com.farmshare.repository;

import com.farmshare.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);
    List<User> findByRole(String role);
    List<User> findByVerificationStatus(String verificationStatus);
    List<User> findByStatus(String status);
}
