package com.farmshare.service;

import com.farmshare.dto.AuthRequest;
import com.farmshare.dto.AuthResponse;
import com.farmshare.dto.RegisterRequest;
import com.farmshare.entity.User;
import com.farmshare.repository.UserRepository;
import com.farmshare.config.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.getIsActive() || "BLOCKED".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("This account has been deactivated by administration.");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user);
    }

    public User register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole().toUpperCase());
        user.setStatus("ACTIVE");
        user.setIsActive(true);
        user.setVerificationStatus("OWNER".equalsIgnoreCase(request.getRole()) ? "PENDING" : "APPROVED");
        user.setVillage(request.getVillage());
        user.setDistrict(request.getDistrict());
        user.setState(request.getState());
        user.setLandAcreage(request.getLandAcreage());
        user.setGovtIdType(request.getGovtIdType());
        user.setGovtIdNumber(request.getGovtIdNumber());

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        boolean willBeActive = !user.getIsActive();
        user.setIsActive(willBeActive);
        user.setStatus(willBeActive ? "ACTIVE" : "BLOCKED");

        return userRepository.save(user);
    }

    public User setOwnerVerificationStatus(Long ownerId, String status) {
        User user = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found: " + ownerId));

        user.setVerificationStatus(status.toUpperCase());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
